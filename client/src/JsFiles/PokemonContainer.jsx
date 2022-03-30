import { PokemonCard } from "./PokemonCards";
import React, { createRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../CssFiles/PokeHome.css";
import { Filtros } from "./PokedexComponentes/Filtros";
const axios = require("axios").default;

export const PokemonContainer = () => {
  const pokemons = useSelector((state) => state);
  const [pokemonsCopy, usePokemonsCopy] = useState();
  const i = 0;
  const dispatch = useDispatch();
  const [min, useMin] = useState(0);
  const [max, useMax] = useState(12);
  const [name, useName] = useState("");
  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  const TraerDatosDeLaApi = async () => {
    const datosPokemon = await (
      await axios.get("http://localhost:3001/pokemons")
    ).data;
    console.log("Se trajeron los Datos");
    usePokemonsCopy(datosPokemon);
    return datosPokemon;
  };
  const TraerPokePorNombre = async (props) => {
    const datosPokemon = await (
      await axios.get(`http://localhost:3001/pokemons?name=${props}`)
    ).data;
    return datosPokemon;
  };
  const mandarLosDatos = async (proms) => {
    await dispatch({
      type: "TraerDatos",
      payload: await proms,
    });
    //console.log(proms)
  };
  let pokemonArray = [];
  pokemonArray = pokemons ? pokemons.slice(min, max) : [];
  const Next = () => {
    useMin(min + 12);
    useMax(max + 12);
  };
  const Prev = () => {
    useMin(min - 12);
    useMax(max - 12);
  };
  const ResetLimits = () => {
    useMin(0);
    useMax(12);
  };
  const filtrarPorName = async (e) => {
    e.preventDefault();
    if (name === "") {
      dispatch({
        type: "Reset",
      });
      if (pokemonsCopy) mandarLosDatos(pokemonsCopy);
      else await mandarLosDatos(await TraerDatosDeLaApi());
      ResetLimits();
    } else {
      let a = await TraerPokePorNombre(name);

      await mandarLosDatos([a]);
      console.log(a);
    }
  };
  const HandleName = (e) => {
    useName(e.target.value);
  };

  useEffect(async () => {
    if (pokemons) {
      if (pokemons.length === 0) {
        await mandarLosDatos(await TraerDatosDeLaApi());
      }
    } else await mandarLosDatos(await TraerDatosDeLaApi());
  }, []);

  return (
    <div className="ContenedorPokedex">
      <h1 className="TituloPokedex"> Esta es la Pokedex</h1>
      <nav className="PokedexNav">
        {min > 0 ? (
          <button className="ButtonFlecha" onClick={Prev}>
            &lt;
          </button>
        ) : (
          <button className="ButtonFlecha">&lt;</button>
        )}
        {pokemons ? (
          max < pokemons.length ? (
            <button className="ButtonFlecha" onClick={Next}>
              &gt;
            </button>
          ) : (
            <button className="ButtonFlecha">&gt;</button>
          )
        ) : (
          <></>
        )}

        <Filtros params={{ pokemonsCopy, ResetLimits }} />

        <form onSubmit={filtrarPorName} className={"SearchName"}>
          <input
            type="text"
            onChange={HandleName}
            placeholder={"Busqueda Por Nombre:"}
          />
          <button type="submit">Buscar</button>
        </form>
      </nav>
      <div className="PokeContainer">
        {pokemons ? (
          <>
            {pokemons.length > 0 ? (
              pokemonArray.map((el) => {
                return <PokemonCard key={RandomKey()} params={el} />;
              })
            ) : (
              <h1>No hay Pokemons</h1>
            )}
          </>
        ) : (
          <h1>Cargando...</h1>
        )}
      </div>
    </div>
  );
};
