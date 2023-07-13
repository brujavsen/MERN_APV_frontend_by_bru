import { createContext, useState, useEffect } from 'react'
import clienteAxios from '../config/axios'
import useAuth from '../hooks/useAuth';
import swal from 'sweetalert';

const PacientesContext = createContext()

export const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState({});
    const { auth } = useAuth();

    useEffect(()=> {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) return;

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: ` Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/pacientes', config);

                setPacientes(data);


            } catch (error) {
                console.log(error)
            }
        }
        obtenerPacientes();
    },[auth]);

    const guardarPaciente = async (paciente) => {

        const token = localStorage.getItem('token')
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: ` Bearer ${token}`
            }
        }

        if(paciente.id) {
            try {
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config);
                
                const pacientesActualizado = pacientes.map( pacienteState => pacienteState._id === data._id ? data : pacienteState);

                setPacientes(pacientesActualizado);
            } catch (error) {
                console.log(error)
            }
        }else {
            try {
                const { data } = await clienteAxios.post('/pacientes', paciente, config);
                const { createdAt, updateAt, __v, ...pacienteAlmacenado } = data;
                setPacientes([pacienteAlmacenado, ...pacientes]);
            } catch (error) {
                console.log(error.response.data.msg)
            }
        }


    }

    const setEdicion = (paciente) => {
        setPaciente(paciente)
    }

    const eliminarPaciente = (id) => {
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: ` Bearer ${token}`
                }
            }
            swal({
                title: "¿Confirmas que deseas eliminar el paciente?",
                icon: "warning",
                buttons: ["Cancelar", "Confirmar"],
                dangerMode: true,
            })
            .then(async (willDelete) => {
                if (willDelete) {
                    swal("¡Listo! Has eliminado el paciente correctamente.", {
                        icon: "success",
                        buttons: false,
                        timer: 1500,
                    });
                    const { data } = await clienteAxios.delete(`/pacientes/${id}`, config)
                    
                    const pacientesActualizado = pacientes.filter(pacientesState => pacientesState._id !== id);

                    setPacientes(pacientesActualizado);
                } else {
                    swal("Cancelaste la operación.", {
                        icon: "error",
                        buttons: false,
                        timer: 1500,
                    });
                }
            });

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <PacientesContext.Provider
            value={{
                pacientes,
                guardarPaciente,
                setEdicion,
                paciente,
                eliminarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )
}

export default PacientesContext;