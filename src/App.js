import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios';
import './App.css';

class Home extends React.Component {
  state = {
    loading: true,
    tasks: [],
  }

  componentDidMount() {
    axios({
      method: 'GET',
      baseURL: 'http://localhost:3001',
      url: '/',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(({ data }) => this.setState({ tasks: data, loading: false }))
      .catch(error => console.dir(error))
  }

  render() {
    const { loading, tasks } = this.state;
    if(loading) return <p>Loading...</p>
    return (
      <div className="tasks">
        {tasks && tasks.length > 0 && tasks.map(task => (
          <div className="task" key={task.taskId}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.done ? 'Task Complete' : 'Task to be Completed'}</p>
            <Link to={`/edit/${task.taskId}`}>Edit Task</Link>
            <Link to={`/delete/${task.taskId}`}>Delete Task</Link>
          </div>
        ))}
      </div>
    )
  }
}

class CreateTask extends React.Component{
  state = {
    title: '',
    description: '',
    done: false
  }

  handleChange = (e) => {
    const { name, value} = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: 'POST',
      baseURL: 'http://localhost:3001',
      url: '/',
      data: this.state,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => this.props.history.push('/')) //if addition is successful redirect to home
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
      <label htmlFor="title">Title</label>
      <input 
        type="text"
        name="title"
        id="title"
        onChange={this.handleChange}
        value={this.state.title}
      />
      <label htmlFor="description">Description</label>
      <input 
        type="text"
        name="description"
        id="description"
        onChange={this.handleChange}
        value={this.state.description}
      />
      <label htmlFor="done">Done?</label>
      <input 
        type="checkbox"
        name="done"
        id="done"
        onChange={this.handleChange}
        checked={this.state.done}
      />
      <button type="submit">Create Task</button>
    </form>
    )
  }
}

class EditTask extends React.Component{
  state = {
    title: '',
    description: '',
    done: false,
    loading: true
  }

  handleChange = (e) => {
    const { name, value} = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { loading, ...data} = this.state;

    axios({
      method: 'PUT',
      baseURL: 'http://localhost:3001',
      url: `/${this.props.match.params.taskId}`,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => this.props.history.push('/'))
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
      <label htmlFor="title">Title</label>
      <input 
        type="text"
        name="title"
        id="title"
        onChange={this.handleChange}
        value={this.state.title}
      />
      <label htmlFor="description">Description</label>
      <input 
        type="text"
        name="description"
        id="description"
        onChange={this.handleChange}
        value={this.state.description}
      />
      <label htmlFor="done">Done?</label>
      <input 
        type="checkbox"
        name="done"
        id="done"
        onChange={this.handleChange}
        checked={this.state.done}
      />
      <button type="submit">Edit Task</button>
    </form>
    )
  }
}

class DeleteTask extends React.Component{
  state = {
    title: null,
    loading: true,
    error: ''
  } 

  handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: 'DELETE',
      baseURL: 'http://localhost:3001',
      url: `/${this.props.match.params.taskId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => this.props.history.push('/'))
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
      <button type="submit">Are you sure?</button>
    </form>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/create" component={CreateTask} />
          <Route exact path="/edit/:taskId" component={EditTask} />
          <Route exact path="/delete/:taskId" component={DeleteTask} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
