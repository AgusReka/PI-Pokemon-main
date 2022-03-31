import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const Filtros = ({ params }) => {
  let {pokemonsCopy} = params;
  let {ResetLimits} = params;
  const dispatch = useDispatch();
  const [tiposDataBase, usetiposDataBase] = useState([]);
  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  const traerDatosFromApi = async () => {
    const datosTipos = await (
      await axios.get("http://localhost:3001/types")
    ).data;
    return datosTipos;
  };
  const FiltrarPorTipo = async (e) => {
    ResetLimits();
    const payload = e.target.value;
    console.log([payload[0].toUpperCase() + payload.substring(1)]);
      
      dispatch({
        type: "FiltrarPorTipo",
        payload: payload,
      });
    
  };
  const FiltrarPorNombre = async (e) => {
    ResetLimits();
    const tipo = e.target.value;
    
      if (tipo === "as") {
        await dispatch({
          type: "FiltarPorNombreOrdenados",
          payload: tipo,
        });
      } else if (tipo === "des") {
        await dispatch({
          type: "FiltarPorNombreOrdenados",
          payload: tipo,
        });
      }else if (tipo === "Reset"){
        await dispatch({
          type: "TraerDatos",
          payload: pokemonsCopy,
        });
      }
    
  };
  const FiltrarPorFuerza = async (e) => {
    ResetLimits();
    const tipo = e.target.value;
    
      if (tipo === "as") {
        await dispatch({
          type: "FiltarPorFuerza",
          payload: tipo,
        });
      } else if (tipo === "des") {
        await dispatch({
          type: "FiltarPorFuerza",
          payload: tipo,
        });
      }else if (tipo === "Reset"){
        await dispatch({
          type: "TraerDatos",
          payload: pokemonsCopy,
        });
      }
    
    console.log(tipo);
  };
  const FiltrarPorCreacion = async (e) => {
    ResetLimits();
    const tipo = e.target.value;

      if (tipo === "Creados") {
        await dispatch({
          type: "TraerDatos",
          payload: pokemonsCopy,
        });
        await dispatch({
          type: "FiltarPorCreados",
          payload: tipo,
        })
      } else if (tipo === "Api") {
        await dispatch({
          type: "TraerDatos",
          payload: pokemonsCopy,
        });
        let b = await dispatch({
          type: "FiltarPorCreados",
          payload: tipo,
        });
        console.log(b);
      } else if (tipo === "Reset"){
        await dispatch({
          type: "TraerDatos",
          payload: pokemonsCopy,
        });
      }
    
    console.log(tipo);
  };
  useEffect(async () => {
    usetiposDataBase(await traerDatosFromApi());
  }, []);
  return (
    <>
      <select onChange={FiltrarPorTipo}>
        <option style={{fontWeight: "bold"}} value={"Reset"}>-Filtrar Por Tipo-</option>
        {tiposDataBase.map((el) => {
          return (
            <option style={{fontWeight: "bold"}} key={RandomKey()} value={el.name}>
              {el.name[0].toUpperCase() + el.name.substring(1)}
            </option>
          );
        })}
      </select>
      <select onChange={FiltrarPorNombre}>
        <option style={{fontWeight: "bold"}} value={"Reset"}>-Filtrar Por Nombre-</option>
        <option style={{fontWeight: "bold"}} value={"as"}>Nombre Ascendente</option>
        <option style={{fontWeight: "bold"}} value={"des"}>Nombre Descendente</option>
      </select>
      <select onChange={FiltrarPorFuerza}>
        <option style={{fontWeight: "bold"}} value={"Reset"}>-Filtrar Por Fuerza-</option>
        <option style={{fontWeight: "bold"}} value={"as"}>Fuerza Ascendente</option>
        <option value={"des"}>Fuerza Descendente</option>
      </select>
      <select onChange={FiltrarPorCreacion}>
        <option style={{fontWeight: "bold"}} value={"Reset"}>-Filtrar Por Creacion-</option>
        <option style={{fontWeight: "bold"}} value={"Creados"}>Creados Por Usuario</option>
        <option style={{fontWeight: "bold"}} value={"Api"}>Traidos De La Api</option>
      </select>
    </>
  );
};
