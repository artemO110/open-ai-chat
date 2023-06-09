

import { useEffect, useState } from "react"


const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handelClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles)
    setValue(null)
  }



  const options = {
    method: "POST",
    body: JSON.stringify({
      message: value
    }),
    headers: {
      "Content-Type": "application/json"
    },
  }
  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }]
      ))
    }
  }, [message, currentTitle, value])


  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={() => handelClick(uniqueTitles)}>{uniqueTitles}</li>)}
        </ul>
        <nav>
          <p> Made by ART</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ArtGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p className="content">{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(event) => setValue(event.target.value)} />
            <div id="submit" onClick={getMessages}>&#129130;</div>
          </div>
          <p className="info">Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia autem maiores aspernatur necessitatibus, reprehenderit molestias ipsum earum minus e.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
