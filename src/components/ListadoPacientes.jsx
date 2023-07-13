import usePacientes from "../hooks/usePacientes"
import Paciente from "./Paciente";
import PacmanLoader from 'react-spinners/PacmanLoader'
import { useState } from "react";

const ListadoPacientes = () => {
    const { pacientes } = usePacientes();
    let [loading, setLoading] = useState(false);

    setTimeout(()=> {
        setLoading(true)
    }, 3000);

    return (
        <>
            {loading ? (
                <>
                    {pacientes.length ? 
                    (
                        <>
                            <h2 className="font-black text-3xl text-center">Listado Pacientes</h2>
        
                            <p className="text-xl mt-5 mb-10 text-center">
                                Administra tus {''}
                                <span className="text-indigo-600 font-bold">Pacientes y Citas</span>
                            </p>
                            {pacientes.map(paciente => (
                                <Paciente 
                                    key={paciente._id}
                                    paciente={paciente}
                                />
                            ))}
                        </>
                    ) : 
                    (
                        <>
                            <h2 className="font-black text-3xl text-center">No hay Pacientes</h2>
        
                            <p className="text-xl mt-5 mb-10 text-center">
                                Comienza agregando pacientes {''}
                                <span className="text-indigo-600 font-bold">para que se muestren aquí</span>
                            </p>
                        </>
                    )}
                </>
            ):(
                <PacmanLoader   
                    cssOverride={{
                        'margin': '0 auto',
                    }}
                    color="#7c3aed"
                />
            )}
            

        </>
    )
}

export default ListadoPacientes