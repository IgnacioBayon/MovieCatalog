import { useState, useEffect } from "react";
import { Form } from "react-router-dom";

export default function PageProfileEdit() {
    const [profileData, setProfileData] = useState({});
    const [canSend, setCanSend] = useState(false);
    useEffect(() => {
      async function getProfileData() {
        const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        setProfileData(data);
      }
      getProfileData();
    }, []);

    function checkPassword(password) {
      const passwordPattern = new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$");
      setCanSend(passwordPattern.test(password));
    }

    function handlePasswordChange(event) {
        const password = event.target.value;
        checkPassword(password);
    }

    return (<div className="container">
    <h2>Hello, {profileData.nombre}</h2>    
    <Form method="post">
      <div className="form-control">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" defaultValue={profileData.nombre} />
      </div>
      <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" defaultValue={profileData.email} />
      </div>
      <div className="form-control">
          <label htmlFor="subject">Tel</label>
          <input type="text" id="tel" name="tel" defaultValue={profileData.tel} />
      </div>
      <div className="form-control">
          <label htmlFor="message">Password</label>
          <input type="password" id="password" name="password" onChange={handlePasswordChange}/>
      </div>
      <button type="submit" disabled={!canSend}>{canSend ? "Save" : "Incorrect Password Format"}</button>
    </Form>
  </div>
  )
};
