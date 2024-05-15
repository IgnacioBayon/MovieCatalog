import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageDeleteUser() {
    const navigate = useNavigate();

    useEffect(() => {
        async function deleteUser() {
            await fetch('http://127.0.0.1:8000/api/users/me/', {
                method: 'DELETE',
                credentials: 'include',
            });
            navigate('/');
        }
        deleteUser();
    }, [navigate]);

    return null; // Return null or a loading spinner
}