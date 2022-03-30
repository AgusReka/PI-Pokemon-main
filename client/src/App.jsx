import "./CssFiles/App.css";
import { Pokedex } from "./JsFiles/Pokedex";
import { HomePage } from "./JsFiles/HomePage";
import { CreatePokemon } from "./JsFiles/CreatePokemon";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { PokemonInfo } from "./JsFiles/PokemonInfo";
import { Page404 } from "./JsFiles/PokedexComponentes/Page404";

const axios = require("axios").default;
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="LinksNav">
          <Link to={"/Pokedex"} className={"Link"}>
            Pokedex
          </Link>
          <Link to={"/"} className={"Link"}>
            PokeHome
          </Link>
          <Link to={"/CreatePokemon"} className={"Link"}>
            CreatePokemon
          </Link>
        </nav>
        <Routes>
          <Route exact path="/Pokedex" element={<Pokedex />} />
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/CreatePokemon" element={<CreatePokemon />} />
          <Route exact path="/Pokedex/:id/:isCreatedByUser" element={<PokemonInfo/> } />
          <Route path='*' element={<Page404/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
