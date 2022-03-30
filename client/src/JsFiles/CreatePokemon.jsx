import "../CssFiles/CreatePoke.css";
import "../CssFiles/InputsCreate.css";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
const axios = require("axios").default;

export const CreatePokemon = () => {
  const dispatch = useDispatch();
  const [propiedades, usePropiedades] = useState([]);
  const [tipos, useTipos] = useState([]);
  const [tiposDataBase, useTiposDataBase] = useState([]);
  const [envioExitoso, useEnvioExitoso] = useState();
  const [datosCorrectos, usedatosCorrectos] = useState({
    name: { bool: false, error: "" },
    vida: { bool: false, error: "" },
    fuerza: { bool: false, error: "" },
    defensa: { bool: false, error: "" },
    velocidad: { bool: false, error: "" },
    altura: { bool: false, error: "" },
    peso: { bool: false, error: "" },
    sprite: { bool: false, error: "" },
  });
  const [tiposCorrectos, usetiposCorrectos] = useState();
  const HandleEnvioExitoso = (params, text) => {
    useEnvioExitoso({ params, text });
  };
  const traerDatosFromApi = async () => {
    const datos = await (await axios.get("http://localhost:3001/types")).data;
    console.log("Se trajeron los Datos");
    //console.log(datos[0])
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
    /*let datosAEnviar = {};
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
      });*/
    let a = Object.keys(datosCorrectos);
    let datos = {};
    a.map((key) => {
      console.log(key);
      if (datosCorrectos[key].bool === false){
        datos = {...datos, [key]: {bool:datosCorrectos[key].bool,error:"No Se Puede Dejar Este Campo Incompleto"}};
      }else if(datosCorrectos[key].bool === true){
        
        datos = {...datos, [key]: {bool:datosCorrectos[key].bool,error:""}};
      }
    });
    console.log(datos);
    usedatosCorrectos(datos);
  };

  const HandleState = async (e) => {
    const value = e.target.value;
    const nombre = e.target.name;
    if (!isNaN(value)) {
      HandleDatosCorrectos(true, "", e.target.name);
      await HandlePropiedades(e.target.name, Number(e.target.value));
    } else {
      if (nombre === "name") {
        if (value.length === 0) {
          console.log("aaaaaa");
        }
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
          let repetido = false;
          propiedades.map((el) => {
            if (el.name == nombre) {
              repetido = true;
            } else repetido = false;
          });
          if (repetido === false)
            await HandlePropiedades(e.target.name, e.target.value);
        }
      } else if (nombre === "sprite") {
        let a = value.substring(0, 8);
        if (a === "https://") {
          HandleDatosCorrectos(true, "", e.target.name);
          await HandlePropiedades(e.target.name, e.target.value);
        } else {
          HandleDatosCorrectos(false, "URL Invalida", e.target.name);
        }
      }
    }
    console.log(value);
  };
  const HandlePropiedades = async (name, value) => {
    await usePropiedades([...propiedades, { name: name, value: value }]);
  };
  const HandlePropiedadesBorrar = async (nombre) => {
    usePropiedades(
      propiedades.filter((e) => {
        return e.name !== nombre;
      })
    );
  };
  const HandleTipos = (e) => {
    if (tipos.length > 1) return;
    let copied = tipos.find((el) => el === e.target.value);
    if (copied) return;
    CambiarTipos(e.target.value);
  };
  const CambiarTipos = (params) => {
    useTipos([...tipos, params]);
  };
  const BorrarTipo = (e) => {
    const name = e.target.name;
    useTipos(
      tipos.filter((el) => {
        if (el !== name) return el !== name;
      })
    );
  };
  const enviarPokemon = async (e) => {
    e.preventDefault();
    const datos = [...propiedades, { tipos: tipos }];
    console.log(datos);
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
        const pokemon = await axios.post("http://localhost:3001/pokemons", {
          ...datosAEnviar,
        });
        let pokeApi = await (
          await axios.get("http://localhost:3001/pokemonsDataBase")
        ).data;
        await dispatch({
          type: "AgregarPokeDatabase",
          payload: await pokeApi,
        });
        HandleEnvioExitoso(true);
      }
    } else {
      await HandleDatosIncorrectos();
      HandleEnvioExitoso(false, "!Faltan Llenar Datos¡");
    }
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
                  <span className="valueCorrecto">&#9745;</span>
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
                placeholder="Sprite (URL):"
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
