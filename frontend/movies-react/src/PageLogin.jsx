import { Form, NavLink, useNavigation, useActionData, useLocation } from "react-router-dom";

export default function PageLogin() {
    return (<div className="container">
    <h2>Login</h2>
    {/* <Form method="post" onSubmit={handleFormSubmit}> */}
    <Form method="post">
        <div className="form-control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" required="" />
        </div>
        <button type="submit">Login</button>
        <NavLink to="/register">Register</NavLink>
    </Form>
    </div>);
}