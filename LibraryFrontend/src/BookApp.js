import React, { Component } from 'react';
import { Card, Button, Col, Container, Row,ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import {SERVER_URL} from './constants.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import noImage from './no-image.png';

class BookApp extends Component {
  constructor(props) {
    super(props);
    this.state = {results: [], error: null, title: '', author: '', publicationYear: undefined, isbn: '', image: '', genres: '', id: null, isLoaded: true, showModal: false}

    this.updateAuthor = this.updateAuthor.bind(this);
    this.updatePublicationYear = this.updatePublicationYear.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateGenres = this.updateGenres.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.updateIsbn = this.updateIsbn.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.addBook = this.addBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.saveBook = this.saveBook.bind(this);
    this.resetBookState = this.resetBookState.bind(this);

    this.fetchData();
  }

  updateAuthor(event) {
      this.setState({author: event.target.value})
  }
  updatePublicationYear(event) {
    this.setState({publicationYear: event.target.value})
  }
  updateTitle(event) {
    this.setState({title: event.target.value})
  }
  updateIsbn(event) {
    this.setState({isbn: event.target.value})
  }
  updateImage(event) {
    this.setState({image: event.target.value})
  }
  updateGenres(event) {
    this.setState({genres: event.target.value})
  }

  handleOpenModal (id) {
    this.getBookValues(id);
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.resetBookState();
    this.setState({ showModal: false });
  }

  getBookValues(id) {
    this.state.results.forEach(item => {
        console.log(item);
        console.log(item['id']);
        if (item['id'] === id) {
            this.state.id = id;
            this.state.author = item['author'];
            this.state.title = item['title'];
            this.state.genres = item['genres'];
            this.state.image = item['image'];
            this.state.isbn = item['isbn'];
            this.state.publicationYear = item['originalPublicationYear']
            return true;
        }
    });
    return false;
  }

  saveBook() {
    let book = this.getBook();
    if(book !== null) {
        const token = sessionStorage.getItem("jwt");
        book.id = this.state.id;
        fetch(SERVER_URL, 
            { method: 'PUT', 
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify(book)
            })
          .then(res => {
              this.fetchData();
              this.resetBookState();
              this.handleCloseModal();
            })
          .catch(err => console.error(err))
    }
  }

  deleteBook(link) {
        console.log("Delete Book");
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + "/" + link, {
          method: 'DELETE',
          headers: {'Authorization': token}})
        .then(res => {
        this.fetchData();
        toast.success("Book deleted", {
            position: toast.POSITION.TOP_CENTER
        });
        })
        .catch(err => {
        toast.error("Error when deleting", {
            position: toast.POSITION.TOP_CENTER
        });
        console.error(err)
        }) 
    }

    addBook() {
        let book = this.getBook();
        if(book !== null) {
          const token = sessionStorage.getItem("jwt");
            fetch(SERVER_URL, 
                { method: 'POST', 
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                  },
                  body: JSON.stringify(book)
                })
              .then(res => {
                  this.fetchData();
                  this.resetBookState();
                })
              .catch(err => console.error(err))
        }
      }
      
    
      resetBookState() {
          this.setState({title: '', author: '', publicationYear: undefined, isbn: '', image: '', genres: '', id: null});
      }
    

    getBook() {
        if (this.state.author == '') {
            toast.error("Author can't be empty", {
                position: toast.POSITION.TOP_CENTER
            });
            return null;
        }
        if (this.state.title == '') {
            toast.error("Title can't be empty", {
                position: toast.POSITION.TOP_CENTER
            });
            return null;
        }
        let body = new Object();
        body.title = this.state.title;
        body.author = this.state.author;
        body.originalPublicationYear = this.state.publicationYear === undefined ? null : this.state.publicationYear;
        body.isbn = this.state.isbn === '' ? null : this.state.isbn;
        body.image = this.state.image === '' ? null : this.state.image;
        body.genres = this.state.genres === '' ? null : this.state.genres;
        return body;
    }

  fetchData() {
    const token = sessionStorage.getItem("jwt");
    this.setState({isLoaded: false})
    fetch(SERVER_URL,
    {
      headers: {'Authorization': token}
    })
      .then(res => res.json())
      .then(
        (result) => {
            console.log(result);
          this.setState({
            isLoaded: true,
            results: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, results } = this.state;
    if (!isLoaded) {
      return <div>
          <ToastContainer autoClose={2000}/>
    <p>Loading...</p>
    </div>;
    }
    else if (results.length > 0) {
      return (
          
        <div>
            <ToastContainer autoClose={2000}/>
            <br></br>
                <div class="book-form">
                <label><h2>Add A Book</h2></label>
                <p>
                    <label>Title (required)</label>
                    <input type="text" value={this.state.title} onChange={this.updateTitle} required/>
                </p>
                <p>
                    <label>Author (required)</label>
                    <input type="text" value={this.state.author} onChange={this.updateAuthor} required />
                </p>
                <p>
                    <label>Genres (separate with commas)</label>
                    <input type="text" value={this.state.genres} onChange={this.updateGenres} />
                </p>
                <p>
                    <label>ISBN</label>
                    <input type="text" value={this.state.isbn} onChange={this.updateIsbn} />
                </p>
                <p>
                    <label>Image URL</label>
                    <input type="text" value={this.state.image} onChange={this.updateImage} />
                </p>
                <p>
                    <label>Publication Year</label>
                    <input type="number" value={this.state.publicationYear} onChange={this.updatePublicationYear} />
                </p>
                <p>
                <Button style={{marginTop:20}} variant="primary" onClick={this.addBook}>Add Book</Button><br></br>
                </p>
                </div>
            <div class='card-box'>
                <Container>
                    <Row className="g-4">
                        {this.state.results.map(function(result){
                                return (
                            <Col sm={4} md={4} lg={4} xl={4} className='mt-3'>
                            <Card>
                            <Card.Title><b>{result['title']}</b></Card.Title>
                                {result['image'] !== null && <Card.Img variant="top" src={result['image']} />}
                                {result['image'] === null && <Card.Img variant="top" src={noImage} />}
                                <Card.Body>
                                <ListGroup className="list-group-flush">
                                    {result['author'] !== null && <ListGroupItem><p><b>Author(s): </b>{result['author']}</p></ListGroupItem>}    
                                    {result['genres'] !== null && <ListGroupItem><p><b>Genre(s): </b>{result['genres']}</p></ListGroupItem>}
                                    {result['originalPublicationYear'] > null && result['originalPublicationYear'] > 0 && <ListGroupItem><p><b>Publication Date: </b>{result['originalPublicationYear']}</p></ListGroupItem>}
                                    {result['isbn'] !== null && <ListGroupItem><p><b>ISBN: </b>{result['isbn']}</p></ListGroupItem>}    
                                </ListGroup>
                                <Button style={{marginTop:20}} variant="primary" onClick={() => this.handleOpenModal (result['id'])}>Edit Book</Button><br></br>
                                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>

                                    <Modal.Header>

                                    <Modal.Title>Edit Book</Modal.Title>

                                    </Modal.Header>

                                    <Modal.Body>
                                    <p>
                                        <label>Title (required)</label>
                                        <input type="text" value={this.state.title} onChange={this.updateTitle} required/>
                                    </p>
                                    <p>
                                        <label>Author (required)</label>
                                        <input type="text" value={this.state.author} placeholder={this.state.author} onChange={this.updateAuthor} required />
                                    </p>
                                    <p>
                                        <label>Genres (separate with commas)</label>
                                        <input type="text" value={this.state.genres} onChange={this.updateGenres} />
                                    </p>
                                    <p>
                                        <label>ISBN</label>
                                        <input type="text" value={this.state.isbn} onChange={this.updateIsbn} />
                                    </p>
                                    <p>
                                        <label>Image URL</label>
                                        <input type="text" value={this.state.image} onChange={this.updateImage} />
                                    </p>
                                    <p>
                                        <label>Publication Year</label>
                                        <input type="number" value={this.state.publicationYear} onChange={this.updatePublicationYear} />
                                    </p>
                                    </Modal.Body>

                                    <Modal.Footer>

                                    <button onClick={this.handleCloseModal}>Cancel</button>

                                    <button onClick={this.saveBook}>Save</button>

                                    </Modal.Footer>
                                </Modal>
                                <Button style={{marginTop:20}} variant="danger" onClick={ () => this.deleteBook (result['id'])}>Delete Book</Button>
                                </Card.Body>
                            </Card>
                            </Col>
                            );
                        }, this)}
                    </Row>
                </Container>
               
            </div>
        </div>
      );
    } else {
      return (
        <div class="book-form">
            <ToastContainer autoClose={2000}/>

                <label><h2>Add A Book</h2></label>
                <p>
                    <label>Title (required)</label>
                    <input type="text" value={this.state.title} onChange={this.updateTitle} required/>
                </p>
                <p>
                    <label>Author (required)</label>
                    <input type="text" value={this.state.author} onChange={this.updateAuthor} required />
                </p>
                <p>
                    <label>Genres (separate with commas)</label>
                    <input type="text" value={this.state.genres} onChange={this.updateGenres} />
                </p>
                <p>
                    <label>ISBN</label>
                    <input type="text" value={this.state.isbn} onChange={this.updateIsbn} />
                </p>
                <p>
                    <label>Image URL</label>
                    <input type="text" value={this.state.image} onChange={this.updateImage} />
                </p>
                <p>
                    <label>Publication Year</label>
                    <input type="number" value={this.state.publicationYear} onChange={this.updatePublicationYear} />
                </p>
                <p>
                <Button style={{marginTop:20}} variant="primary" onClick={this.addBook}>Add Book</Button><br></br>
                </p>
  
      </div>
      )
    }
 }

}

export default BookApp;