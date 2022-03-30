import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "../CssFiles/PokeInfo.css";
export const PokemonInfo = () => {
  let params = useParams();

  let pokemon = useSelector((state) => state);

  const [pokeDatos, usePokeDatos] = useState();
  const [poke, usePoke] = useState({});

  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  const HandlePokeDatos = (props) => {
    usePokeDatos(props);
  };

  useEffect(async () => {
    let p;
    let b = params.isCreatedByUser;
    if (params.isCreatedByUser === "true") {
      p = await (
        await axios.get(`http://localhost:3001/pokemonsDataBase`)
      ).data;
      let a = p.find((el) => {
        return el.id === Number(params.id);
      });

      if (a) {
        console.log(a);
        HandlePokeDatos(a);
      } else {
        p = "No se encontro ese pokemon";
        console.log(p);
        HandlePokeDatos(p);
      }
    } else if (params.isCreatedByUser === "false") {
      p = await (
        await axios.get(`http://localhost:3001/pokemons/${params.id}`)
      ).data;
      console.log("PPP", p);
      console.log(typeof p === "string");
      HandlePokeDatos(p);
    }
    console.log(p);
  }, []);

  return (
    <div className="PokemonInfoContainer">
      {pokeDatos ? (
        typeof pokeDatos !== "string" ? (
          <>
            <div className="Pokemon">
              <h1>
                {"#" + (pokeDatos.id || pokeDatos.pokedex_id)}{" "}
                {pokeDatos.name[0].toUpperCase() + pokeDatos.name.substring(1)}{" "}
              </h1>
              <img src={pokeDatos.sprite} alt="" />
            </div>
            <div className="PokemonStats">
              <h3 className="Title">Stats</h3>
              {pokeDatos.stats ? (
                pokeDatos.stats.map((el) => {
                  if (
                    el.name === "special-attack" ||
                    el.name === "special-defense"
                  )
                    return;
                  return (
                    <h3 key={RandomKey()}>
                      {el.name[0].toUpperCase() + el.name.substring(1)}:{" "}
                      {el.value}
                    </h3>
                  );
                })
              ) : (
                <>
                  <h3>Hp: {pokeDatos.vida}</h3>
                  <h3>Attack: {pokeDatos.fuerza}</h3>
                  <h3>Defense: {pokeDatos.defensa}</h3>
                  <h3>Speed: {pokeDatos.velocidad}</h3>
                  <h3>Height: {pokeDatos.altura}</h3>
                  <h3>Weight: {pokeDatos.peso}</h3>
                </>
              )}
              <h3 className="Title">Types</h3>
              <div>
                <div className="PokemonTypes">
                  {pokeDatos.types ? (
                    pokeDatos.types.map((el) => {
                      return (
                        <h3 key={RandomKey()}>
                          {el.name[0].toUpperCase() + el.name.substring(1)}
                        </h3>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  {pokeDatos.tipos ? (
                    pokeDatos.tipos.map((el) => {
                      return (
                        <h3 key={RandomKey()}>
                          {el.name[0].toUpperCase() + el.name.substring(1)}
                        </h3>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <h1>{pokeDatos}</h1>
        )
      ) : (
        <h3>Cargando...</h3>
      )}
    </div>
  );
};
