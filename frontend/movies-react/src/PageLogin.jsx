import { Form, NavLink, useNavigation, useActionData, useLocation } from "react-router-dom";

export default function PageLogin() {
    const actionData = useActionData();
    return (<div className="container">
    <h2>Login</h2>
    {actionData && actionData.status !== 200 && (
        <p className="error-message">Invalid email or password</p>
    )}
    <Form method="post">
        <div className="form-control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" required="" />
        </div>
        <button type="submit"><strong>Login</strong></button>
        <p><br/>Do you not have an account? Create one!</p>
        <NavLink to="/register">
            <button id="register"><strong>Register</strong></button>
        </NavLink>
    </Form>
    </div>);
}