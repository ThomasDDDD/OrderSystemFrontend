import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const ErrorPage = () => {

    const location = useLocation();
    const error = location.state?.error;
    
    const [redirect, setRedirect] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!error) {
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        setRedirect(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [error]);

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <section id="error-page">
            <h1>Oops!</h1>
            <p>
                <i>{error ? error.message : "404 - Site not found"}</i>
            </p>
            <p>
                Redirecting in {countdown} {countdown === 1 ? "second" : "seconds"}...
            </p>
        </section>
    );
}