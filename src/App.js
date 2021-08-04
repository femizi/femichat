import React, { useRef, useState } from 'react'
import './App.css';



import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDHN7uJOS4RBXDq3vUT_MqS9z0bqp50zic",
  authDomain: "femichat-eb0c3.firebaseapp.com",
  projectId: "femichat-eb0c3",
  storageBucket: "femichat-eb0c3.appspot.com",
  messagingSenderId: "223659882765",
  appId: "1:223659882765:web:9cc9338c92d0c4214f1844",
  measurementId: "G-NMYGGLKR4P"
})

const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {

  const [user] = useAuthState(auth);
  console.log([user]);
  return (
    <div className="App">
      <header>
        <h1> Femi Chat</h1>
        <SignOut/>
        
        
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>

    </div>
  );
}

function SignIn(){
  const singInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  
  

  return(
    <button onClick={singInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}
 function ChatRoom(){

  const dummy =useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
   





     setFormValue('');
     dummy.current.scrollIntoView({ behavior: 'smooth'});
   }
   return (
     <>
     <div>
       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
       <div ref={dummy}></div>
     </div>
     <form onSubmit={sendMessage}>
       <input value= {formValue} onChange={(e) => setFormValue(e.target.value)}/>
       <button type="submit">Send</button>
      
     </form>
     </>
   )
 }

 function ChatMessage (props) {
   const {text, uid, photoUrl} = props.message;
   const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
   return (
     <div className = {`message ${messageClass}`}>
       <img alt="avatar"src={photoUrl || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
       <p>{text}</p>
     </div>
   )
 }
export default App;
