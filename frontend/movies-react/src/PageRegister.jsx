import { Form, NavLink, useNavigation, useActionData, useLocation } from "react-router-dom";

export default function PageRegister() {
    return (<div className="container">
    <h2>Register</h2>
    <Form method="post">
        <div className="form-control">
            <label htmlFor="username">Name</label>
            <input type="text" id="nombre" placeholder="Username" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="tel">Telephone</label>
            <input type="tel" id="tel" placeholder="Telephone" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Email" required="" />
        </div>
        <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Password" required="" />
        </div>
        {/* <div className="form-control">
            <label htmlFor="password">Confirm Password</label>
            <input type="password" id="password" placeholder="Password" required="" />
        </div> */}
        <button type="submit">Register</button>
    </Form>
  </div>);
}