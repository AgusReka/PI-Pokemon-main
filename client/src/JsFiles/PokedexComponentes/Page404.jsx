import { Link } from "react-router-dom";
import "../../CssFiles/Page404.css";
export const Page404 = () => {
  return (
      <div className="Page404">
          <img src="/Archives/snorlax.png" alt="imagen404" />
          <Link to={"/Pokedex"} className={"Link"}>
           <h3>Voler a a la Pokedex</h3> 
          </Link>
      </div>
  );
}