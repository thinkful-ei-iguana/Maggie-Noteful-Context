import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import './App.css';
import NoteContext from '../NoteContext';
import Endpoint from '../endpoint';

class App extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      notes: [],
      folders: [],
      deleteNote: this.handleDeleteNote
    };
  }
  

  componentDidMount() {
    
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // };
    Promise.all([
      fetch(`${Endpoint.API_ENDPOINT}/folders`),
      fetch(`${Endpoint.API_ENDPOINT}/notes`)
    ])  
      .then(([foldersResponse, notesResponse]) => {
        if(!foldersResponse.ok)
          return foldersResponse.json().then(error => {
            throw error;
          })
        if(!notesResponse.ok)
          return notesResponse.json().then(error => {
            throw error;
          })
          return Promise.all([foldersResponse.json(), notesResponse.json()]);
      })
      .then(([folders, notes]) => {
        this.setState({folders, notes});
      });
    }
    
      handleDeleteNote = (noteId) => {
        this.setState({
          notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };
  
  
  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListNav}
          />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }
  
  renderMainRoutes() {
    const {notes, folders} = this.state;
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
      </>
    );
  }

  render() {
    
    return (
      <NoteContext.Provider value={this.state}>
        <div className="App">
          <nav className="App__nav">{this.renderNavRoutes()}</nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{' '}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <main className="App__main">{this.renderMainRoutes()}</main>
        </div>
      </NoteContext.Provider>
    );
  }
}

export default App;
