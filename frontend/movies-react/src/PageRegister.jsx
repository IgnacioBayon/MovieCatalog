import { Form, NavLink, useNavigation, useActionData, useLocation } from "react-router-dom";

export default function PageRegister() {
    const actionData = useActionData();
    return (<div className="container">
    <h2>Register</h2>
    {actionData && actionData.status === 409 && (
        <p className="error-message">Account already exists Please try again</p>
      )}
    {actionData && actionData.status === 400 && (
        <div>
            <p className="error-message">Incorrect data format</p>
            <p>Please check your input and try again. Remember that the password must follow the following rules:</p>
            <ul>
                <li>At least 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
            </ul>
        </div>
    )}
    <Form method="post">
        <div className="form-control">
            <label htmlFor="nombre">Name</label>
            <input type="text" id="nombre" name="nombre" placeholder="Username" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="tel">Telephone</label>
            <input type="tel" id="tel" name="tel" placeholder="Telephone" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" required="" />
        </div>
        <button type="submit">Register</button>
    </Form>
  </div>);
}