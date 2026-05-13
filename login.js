import 'bootstrap/dist/css/bootstrap.min.css';

import { useState} from'react';
import { Form,Row,col,Button } from 'react-bootstrap';

export default function login(){
    const[validated , setValidated] = useState(false);
    const[username, setUsername] = useState("");
    const[password,setPassword] = useState("");
}