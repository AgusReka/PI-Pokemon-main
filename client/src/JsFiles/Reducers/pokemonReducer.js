const axios = require("axios").default;
export const pokemonReducer = (state = {data:[],detalle:[],copy:[]}, action) => {
  switch (action.type) {
    case "TraerDatos":
      //const datos = await axios.get("http:localhost:3001/pokemons")
      return {...state,data: action.payload,copy:action.payload}
    case "Reset":
      //const datos = await axios.get("http:localhost:3001/pokemons")
      return (state = []);
    case "AgregarPokeDatabase":
      let pokeApis = state.filter((el) => el.hasOwnProperty("pokedex_id"));
      let pokeDataBase = action.payload;
      return (state = [...pokeDataBase, ...pokeApis]);
    case "FiltarPorFuerza":
      const mergeSortF = (arr) => {
        if (arr.length < 2) {
          return arr;
        }
        const middle = parseInt(arr.length / 2) | 0;
        const left = arr.slice(0, middle);
        const right = arr.slice(middle);

        const merge = (left, right) => {
          const result = [];
          let il = 0,
            ir = 0;
          while (il < left.length && ir < right.length) {
            if(action.payload === "des"){
              result.push(
                (left[il].stats ? left[il].stats[1].value : left[il].fuerza) >
                  (right[ir].stats ? right[ir].stats[1].value : right[ir].fuerza)
                  ? left[il++]
                  : right[ir++]
              );
            }else if(action.payload === "as"){
              result.push(
                (left[il].stats ? left[il].stats[1].value : left[il].fuerza) <
                  (right[ir].stats ? right[ir].stats[1].value : right[ir].fuerza)
                  ? left[il++]
                  : right[ir++]
              );
            }
            
          }

          return [...result, ...left.slice(il), ...right.slice(ir)];
        };

        return merge(mergeSortF(left), mergeSortF(right));
      };
      return (state = mergeSortF(state));
    case "FiltrarPorTipo":
      //const datos = await axios.get("http:localhost:3001/pokemons")
      const filtrados = (el) => {
        if (
          (el.types
            ? el.types[0].name
            : el.tipos[0].name[0].toUpperCase() +
              el.tipos[0].name.substring(1)) ===
          action.payload[0].toUpperCase() + action.payload.substring(1)
        ) {
          return true;
        } else {
          if (el.types ? el.types[1] : el.tipos[1]) {
            if (
              (el.types
                ? el.types[1].name
                : el.tipos[1].name[0].toUpperCase() +
                  el.tipos[1].name.substring(1)) ===
              action.payload[0].toUpperCase() + action.payload.substring(1)
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      };
      return state.filter(filtrados);

    case "FiltarPorNombreOrdenados":
      const mergeSortDes = (arr) => {
        if (arr.length < 2) {
          return arr;
        }
        const middle = parseInt(arr.length / 2) | 0;
        const left = arr.slice(0, middle);
        const right = arr.slice(middle);

        const merge = (left, right) => {
          const result = [];
          let il = 0,
            ir = 0;
          while (il < left.length && ir < right.length) {
            if(action.payload === "des"){
              result.push(
                left[il].name > right[ir].name ? left[il++] : right[ir++]
              );
            } else if(action.payload === "as"){
              result.push(
                left[il].name < right[ir].name ? left[il++] : right[ir++]
              );
            }
          }
          return [...result, ...left.slice(il), ...right.slice(ir)];
        };

        return merge(mergeSortDes(left), mergeSortDes(right));
      };
      return (state = mergeSortDes(state));
      case "FiltarPorCreados":
        if(action.payload === "Creados"){
          let creados = state.filter((el)=>el.hasOwnProperty("id"));
          console.log(creados);
          return creados;
        }else if(action.payload === "Api"){
          return state.filter((el)=>el.hasOwnProperty("pokedex_id"));
        }
      break;
    default:
      break;
  }
};
