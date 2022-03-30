import { Link } from "react-router-dom";
import "../CssFiles/PokeCard.css";
export const PokemonCard = ({ params }) => {
  console.log(params);
  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  return typeof params === "string" ? (
    <h4>POKEMON NO ENCONTRADO</h4>
  ) : (
    <div className="PokeCard">
      <span>
        <h4>
          {(params.id
            ? "#" + params.id
            : params.pokedex_id
            ? "#" + params.pokedex_id
            : "") + " "}
          {params.name ? params.name : ""}
        </h4>
      </span>

      <Link
        to={`/Pokedex/${
          params.id ? params.id : params.pokedex_id
        }/${params.hasOwnProperty("id")}`}
      >
        {params.hasOwnProperty("sprite") ? (
          params.sprite === "" ? (
            <img
              src="https://i.ytimg.com/vi/Ubc6ZMsFcd0/maxresdefault.jpg"
              alt="pokeImg"
            />
          ) : (
            <img src={params.sprite} alt="pokeImg" />
          )
        ) : (
          <img
            src="https://i.ytimg.com/vi/Ubc6ZMsFcd0/maxresdefault.jpg"
            alt="pokeImg"
          />
        )}
      </Link>
      <div className="Types">
        {params.types ? (
          params.types.map((el) => {
            return <h3 key={RandomKey()}>{el.name}</h3>;
          })
        ) : (
          <></>
        )}
        {params.tipos ? (
          params.tipos.map((el) => {
            return <h3 key={RandomKey()}>{el.name}</h3>;
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
