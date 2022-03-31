import "../CssFiles/CreatePoke.css";
import "../CssFiles/InputsCreate.css";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
const axios = require("axios").default;

export const CreatePokemon = () => {
  const dispatch = useDispatch();
  const [propiedades, usePropiedades] = useState({});
  const [tipos, useTipos] = useState([]);
  const [tiposDataBase, useTiposDataBase] = useState([]);
  const [envioExitoso, useEnvioExitoso] = useState();
  const [datosCorrectos, usedatosCorrectos] = useState({
    name: { bool: false, error: "Campo Requerido" },
    vida: { bool: false, error: "Campo Requerido" },
    fuerza: { bool: false, error: "Campo Requerido" },
    defensa: { bool: false, error: "Campo Requerido" },
    velocidad: { bool: false, error: "Campo Requerido" },
    altura: { bool: false, error: "Campo Requerido" },
    peso: { bool: false, error: "Campo Requerido" },
    sprite: { bool: false, error: "" },
    tipos: { bool: false, error: "Hace Falta 1 Tipo" },
  });
  const [tiposCorrectos, usetiposCorrectos] = useState();
  const HandleEnvioExitoso = (params, text) => {
    useEnvioExitoso({ params, text });
  };
  const traerDatosFromApi = async () => {
    const datos = await (await axios.get("http://localhost:3001/types")).data;
    console.log("Se trajeron los Datos");
    return datos;
  };
  const HandleTiposDataBase = (params) => {
    useTiposDataBase(params);
  };
  useEffect(async () => {
    const datos = await traerDatosFromApi();
    HandleTiposDataBase(datos);
  }, []);
  const HandleDatosCorrectos = (bool, error, name) => {
    usedatosCorrectos({ ...datosCorrectos, [name]: { bool, error } });
    return "i: " + name;
  };
  const HandleDatosIncorrectos = async () => {
    let a = Object.keys(datosCorrectos);
    let datos = {};
    a.map((key) => {
      if (datosCorrectos[key].bool === false) {
        datos = {
          ...datos,
          [key]: {
            bool: datosCorrectos[key].bool,
            error:
              key === "tipos" ? "Hace Falta 1 Tipo": key !== "sprite" ? "No Se Puede Dejar Este Campo Incompleto"
                : "",
          },
        };
      } else if (datosCorrectos[key].bool === true) {
        datos = {
          ...datos,
          [key]: { bool: datosCorrectos[key].bool, error: "" },
        };
      }
    });
    usedatosCorrectos(datos);
  };

  const HandleState = async (e) => {
    const value = e.target.value;
    const nombre = e.target.name;
    if (nombre === "name") {
      if (value.length < 3) {
        console.log("El Nombre Debe Contener Minimo 3 Letras");
        HandleDatosCorrectos(
          false,
          "El Nombre Debe Contener Minimo 3 Letras",
          e.target.name
        );
        HandlePropiedadesBorrar(nombre);
      } else if (value.length > 10) {
        console.log("El Nombre Debe Contener Maximo 10 Letras");
        HandleDatosCorrectos(
          false,
          "El Nombre Debe Contener Maximo 10 Letras",
          e.target.name
        );
        HandlePropiedadesBorrar(nombre);
      } else {
        HandleDatosCorrectos(true, "", e.target.name);
        await HandlePropiedades(e.target.name, e.target.value);
      }
    } else if (nombre === "sprite") {
      let a = value.substring(0, 8);
      if (a === "https://" || a === "") {
        HandleDatosCorrectos(true, "", e.target.name);
        await HandlePropiedades(e.target.name, e.target.value);
      } else {
        HandleDatosCorrectos(false, "URL Invalida", e.target.name);
      }
    }else{
      if (!isNaN(value)) {
        if (value > 0) {
          HandleDatosCorrectos(true, "", e.target.name);
          await HandlePropiedades(e.target.name, Number(e.target.value));
        } else {
          HandleDatosCorrectos(
            false,
            "El Numero Debe Ser Mayor A 0",
            e.target.name
          );
        }
      } 
    }
  };
  const HandlePropiedades = async (name, value) => {
    let a = { ...propiedades, [name]: { name: name, value: value } };
    await usePropiedades(a);
  };
  const HandlePropiedadesBorrar = async (nombre) => {
    usePropiedades({ ...propiedades, [nombre]: { bool: false, value: "" } });
  };
  const HandleTipos = (e) => {
    if (tipos.length > 1) return;
    let copied = tipos.find((el) => el === e.target.value);
    if (copied) return;
    HandleDatosCorrectos(true, "", e.target.name);
    CambiarTipos(e.target.value);
  };
  const CambiarTipos = (params) => {
    useTipos([...tipos, params]);
  };
  const BorrarTipo = (e) => {
    const name = e.target.name;
    let a = tipos.filter((el) => {
      if (el !== name) return el !== name;
    });
    if (a.length < 1) {
      HandleDatosCorrectos(false, "Hace Falta 1 Tipo", "tipos");
    }
    useTipos(a);
  };
  const enviarPokemon = async (e) => {
    e.preventDefault();
    const datos = { ...propiedades, tipos: tipos };
    console.log(datos);
    let poke = {};
    let keysPropiedades = Object.keys(datos);
    let keysDatosCorrectos = Object.keys(datosCorrectos);
    if (keysPropiedades.length < 9) {
      await HandleDatosIncorrectos();
      HandleEnvioExitoso(false, "!Faltan Llenar Datos¡");
    } else {
      let puedeMandar = true;
      keysDatosCorrectos.map((key) => {
        if (datosCorrectos[key].bool) {
          if (puedeMandar !== false) {
            puedeMandar = true;
          }
        } else {
          puedeMandar = false;
        }
      });
      if (puedeMandar) {
        keysPropiedades.map((key) => {
          if (key === "tipos") {
            poke = { ...poke, [key]: datos[key] };
          } else {
            poke = { ...poke, [key]: datos[key].value };
          }
        });
        console.log(poke);
        const pokemon = await axios.post("http://localhost:3001/pokemons", {
          ...poke,
        });
        let pokeApi = await (
          await axios.get("http://localhost:3001/pokemonsDataBase")
        ).data;
        await dispatch({
          type: "AgregarPokeDatabase",
          payload: await pokeApi,
        });
        HandleEnvioExitoso(true);
      } else {
        await HandleDatosIncorrectos();
        HandleEnvioExitoso(false, "!Faltan Llenar Datos¡");
      }
    }
    /*
    if (datos.length > 8) {
      if (datos[datos.length - 1].tipos.length < 1)
        HandleEnvioExitoso(false, "!Faltan Llenar Datos¡");
      else {
        let datosAEnviar = {};
        datos.map((el) => {
          if (el.tipos) {
            datosAEnviar = {
              ...datosAEnviar,
              tipos: el.tipos.map((elTipos) => {
                return elTipos;
              }),
            };
          } else {
            datosAEnviar = { ...datosAEnviar, [el.name]: el.value };
          }
        });
        console.log(datosAEnviar.tipos);
        
      }
    } else {
      await HandleDatosIncorrectos();
      HandleEnvioExitoso(false, "!Faltan Llenar Datos¡");
    }*/
  };
  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  return (
    <div className={"CreatePokemon"}>
      <h1>Welcome To Create Pokemon</h1>
      {tiposDataBase.length < 1 ? (
        <h1>Cargando...</h1>
      ) : (
        <form className="FormularioPokemon" onSubmit={enviarPokemon}>
          <>
            <h2>¡Crea Tu Propio Pokemon!</h2>
            <div className="NameInput">
              <input
                placeholder="Name:"
                name="name"
                type="text"
                onChange={HandleState}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.name.bool ? (
                  propiedades["name"].value != 0 ? (
                    <span className="valueCorrecto">&#9745;</span>
                  ) : (
                    <span className="valueIncorrecto">
                      <h3>Campo Requerido</h3>
                    </span>
                  )
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.name.error ? (
                      <h3>{datosCorrectos.name.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>

            <div className="NameInput">
              <input
                placeholder="Hp:"
                name="vida"
                type="number"
                onChange={HandleState}
                max={150}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.vida.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.vida.error ? (
                      <h3>{datosCorrectos.vida.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>

            <div className="NameInput">
              <input
                placeholder="Fuerza:"
                name="fuerza"
                type="number"
                onChange={HandleState}
                max={150}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.fuerza.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.fuerza.error ? (
                      <h3>{datosCorrectos.fuerza.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="NameInput">
              <input
                placeholder="Defensa:"
                name="defensa"
                type="number"
                onChange={HandleState}
                max={150}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.defensa.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.defensa.error ? (
                      <h3>{datosCorrectos.defensa.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="NameInput">
              <input
                placeholder="Velocidad:"
                max={150}
                name="velocidad"
                type="number"
                onChange={HandleState}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.velocidad.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.velocidad.error ? (
                      <h3>{datosCorrectos.velocidad.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="NameInput">
              <input
                max={150}
                placeholder="Altura:"
                name="altura"
                type="number"
                onChange={HandleState}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.altura.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.altura.error ? (
                      <h3>{datosCorrectos.altura.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="NameInput">
              <input
                max={150}
                placeholder="Peso:"
                name="peso"
                type="number"
                onChange={HandleState}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.peso.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.peso.error ? (
                      <h3>{datosCorrectos.peso.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="NameInput">
              <input
                max={150}
                placeholder="Sprite (URL): Este Campo Puede Estar Vacio"
                name="sprite"
                type="url"
                onChange={HandleState}
              />
              {datosCorrectos != undefined ? (
                datosCorrectos.sprite.bool ? (
                  <span className="valueCorrecto">&#9745;</span>
                ) : (
                  <span className="valueIncorrecto">
                    {datosCorrectos.sprite.error ? (
                      <h3>{datosCorrectos.sprite.error}</h3>
                    ) : (
                      <></>
                    )}
                  </span>
                )
              ) : (
                <></>
              )}
            </div>
          </>
          <select name="tipos" onChange={HandleTipos} defaultValue="NingunTipo">
            <option>Elije El Tipo</option>
            {tiposDataBase.map((el) => {
              return (
                <option key={RandomKey()} value={el.name}>
                  {el.name[0].toUpperCase() + el.name.substring(1)}
                </option>
              );
            })}
          </select>

          <div className="TiposFormulario">
            {tipos.map((el) => {
              return (
                <span key={RandomKey()}>
                  <h3>{el.toUpperCase()}</h3>
                  <button onClick={BorrarTipo} name={el}>
                    x
                  </button>
                </span>
              );
            })}
            {datosCorrectos != undefined ? (
              tipos.length > 0 ? (
                <span className="valueCorrecto">&#9745;</span>
              ) : (
                <span className="valueIncorrecto">
                  <h3>{datosCorrectos["tipos"].error}</h3>
                </span>
              )
            ) : (
              <></>
            )}
          </div>
          {envioExitoso != undefined ? (
            envioExitoso.params ? (
              <h4 className="InfoCreacionText">
                Se creo el pokemon exitosamente
              </h4>
            ) : envioExitoso.text ? (
              <h4 className="InfoCreacionText">{envioExitoso.text}</h4>
            ) : (
              <h4 className="InfoCreacionText">No Se Creo El Pokemon</h4>
            )
          ) : (
            <></>
          )}
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};
