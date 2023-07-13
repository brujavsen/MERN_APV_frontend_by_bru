import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/axios'
import swal from 'sweetalert'

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const [ cargando, setCargando ] = useState(true)
    const [ auth, setAuth ] = useState({})
 
    useEffect(()=> {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');

            if(!token) {
                setCargando(false);
                return
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/veterinarios/perfil', config);
                
                setAuth(data);

            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({});
            }
            setCargando(false)
        }
        autenticarUsuario();
    }, []);

    const cerrarSesion = () => {
        swal({
            title: "¿Deseas cerrar sesión?",
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
        })
        .then((close) => {   
            if (close) {
                swal("Has cerrado sesión correctamente.", {
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
                setTimeout(()=> {
                    localStorage.removeItem('token')
                    setAuth({})
                }, 2000);
            }
        });
    }

    const actualizarPerfil = async (datos) => {
        const token = localStorage.getItem('token');

        if(!token) {
            setCargando(false);
            return
        };

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const url = `/veterinarios/perfil/${datos._id}`
            const { data } = await clienteAxios.put(url, datos, config);

            return {
                msg: 'Almacenado Correctamente'
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }

    const guardarPassword = async (datos) => {
        const token = localStorage.getItem('token');
        if(!token) {
            setCargando(false);
            return
        };
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
          const url = '/veterinarios/actualizar-password';
          
          const {data} = await clienteAxios.put(url, datos, config)

          return {
            msg: data.msg
          }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}
        >
            {children}        
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext