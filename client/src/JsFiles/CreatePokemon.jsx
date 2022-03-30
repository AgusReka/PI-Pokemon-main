import "../CssFiles/CreatePoke.css";
import React, {useEffect, useState} from "react";

import {useDispatch, useSelector} from "react-redux";
const axios = require("axios").default;

export const CreatePokemon = () => {
  const dispatch = useDispatch();
  const [propiedades, usePropiedades] = useState({sprite:""});
  const [tipos, useTipos] = useState([]);
  const [tiposDataBase, useTiposDataBase] = useState([]);
  const [envioExitoso, useEnvioExitoso] = useState();
  const HandleEnvioExitoso = (params, text) => {
    useEnvioExitoso({params, text});
  };
  const traerDatosFromApi = async () => {
    const datos = await (
      await axios.get("http://localhost:3001/types")
    ).data;
    console.log("Se trajeron los Datos");
    //console.log(datos[0])
    return datos;
  };
  const HandleTiposDataBase = (params) => {
    useTiposDataBase(params);
  };
  useEffect(async () => {
    const datos = await traerDatosFromApi();
    console.log(datos);
    HandleTiposDataBase(datos);
  }, []);
  const HandleState = async (e) => {
    const value = e.target.value;
    if (!isNaN(value))
      await HandlePropiedades(e.target.name, Number(e.target.value));
    else await HandlePropiedades(e.target.name, e.target.value);
    console.log(value);
  };
  const HandlePropiedades = async (name, value) => {
    await usePropiedades({...propiedades, [name]: value});
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
      tipos.filter((el) => {if (el !== name) return el !== name})
    );
  };
  const enviarPokemon = async (e) => {
    e.preventDefault();
    const datos = {...propiedades, tipos: tipos};
    console.log(datos);
    if (Object.keys(datos).length > 8) {
      if (datos.tipos.length < 1)
        HandleEnvioExitoso(false, "!Faltan Llenar Datos¡");
      else {
        const pokemon = await axios.post(
          "http://localhost:3001/pokemons",
          datos
        );
        let pokeApi = await (
          await axios.get(
            "http://localhost:3001/pokemonsDataBase"
          )
        ).data;
        await dispatch({
          type: "AgregarPokeDatabase",
          payload: await pokeApi,
        });
        HandleEnvioExitoso(true);
      }
    } else {
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
            <input
              placeholder="Name:"
              name="name"
              type="text"
              onChange={HandleState}
              maxLength={10}
            />
            <input
              placeholder="Hp:"
              name="vida"
              type="number"
              onChange={HandleState}
              max={150}
            />
            <input
              placeholder="Fuerza:"
              name="fuerza"
              type="number"
              onChange={HandleState}
              max={150}
            />
            <input
              placeholder="Defensa:"
              name="defensa"
              type="number"
              onChange={HandleState}
              max={150}
            />
            <input
              placeholder="Velocidad:"
              max={150}
              name="velocidad"
              type="number"
              onChange={HandleState}
            />
            <input
              max={150}
              placeholder="Altura:"
              name="altura"
              type="number"
              onChange={HandleState}
            />
            <input
              max={150}
              placeholder="Peso:"
              name="peso"
              type="number"
              onChange={HandleState}
            />
            <input
              max={150}
              placeholder="Sprite (URL):"
              name="sprite"
              type="url"
              onChange={HandleState}
            />
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
