import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Note.css';
import Endpoint from '../endpoint';
import NoteContext from '../NoteContext';

export default class Note extends React.Component {
  
  static contextType = NoteContext;

  handleDeleteClick = (e) => {
    e.preventDefault();
    const noteId = this.props.id

    console.log('this.context is', this.context);
    console.log('this.props is', this.props);

    fetch(`${Endpoint.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
          'content-type': 'application/json'
      }
    })
      .then(response => {
        if(!response.ok) {
          return response.json().then(error => {
            throw error;
          })
        }
        return response.json();
      })
      .then(() => {
        this.context.deleteNote(noteId)
        this.props.handleDeleteClick(noteId)
      })
      .catch(error => {console.error({error})
    })
  }  


  render() {

    const { id, modified, name } = this.props
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button className='Note__delete' type='button'>
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
