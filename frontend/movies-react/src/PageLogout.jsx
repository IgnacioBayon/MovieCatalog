import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageLogout() {
    const navigate = useNavigate();

    useEffect(() => {
        async function logout() {
            await fetch('http://127.0.0.1:8000/api/users/logout/', {
                method: 'DELETE',
                credentials: 'include',
            });
            navigate('/');
        }
        logout();
    }, [navigate]);

    return null; // Return null or a loading spinner
}