import { Link, NavLink } from "react-router-dom";
import "../CssFiles/PokeCard.css";
export const PokemonCard = ({ params }) => {
  //console.log(params)
  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  return (
    <div className="PokeCard">
      <span>
        <h4>
          {"#"+(params.id || params.pokedex_id)+" "}
          {params.name}
        </h4>
      </span>

      <Link
        to={`/Pokedex/${
          params.id ? params.id : params.pokedex_id
        }/${params.hasOwnProperty("id")}`}
      >
        <img
          src={
            params.hasOwnProperty("sprite")
              ? params.sprite
              : "https://cdn.vox-cdn.com/thumbor/IhuPwFLVg19jF8B6rSmpy5T1-tY=/0x0:1920x1080/1400x788/filters:focal(807x387:1113x693):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/53254027/who_pokemon.0.jpg"
          }
          alt="PokemonImage"
        />
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
