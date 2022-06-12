import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import Input from './Input';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  
  const [quesPprArr,setQuesPprArr]  = useState([]);
  const [quesArr,setQuesArr]  = useState([]);
  const [pprId, setPprId] = useState();
  const [queId, setQueId] = useState();
  const [pmode, setPmode] = useState(true);
  const [pushDb, setPushDb] = useState(false);
  const [accOpen , setAccOpen]  = useState(-1);

  const URL = "http://localhost:8080/python";

  useEffect(() => {
    var config = {
      method: 'get',
      url: URL+"/allSets"
    };
    
    axios(config)
      .then(function (response) {
        setQuesPprArr(response.data);
      });
    
  }, [pprId]);

  const paperLoad = (e)=>{
    if(e === -1) return;
    var config = {
      method: 'get',
      url: URL+"/question?setId="+e
    };
    
    axios(config)
    .then(function (response) {
      setQuesArr(response.data);
      setPprId(e);
    })
  }
   
  const newSet =()=>{
    var name = prompt("Enter Set name");
    var type = prompt("Enter type of set (problem or workshop)");
    var diff = prompt('Enter difficulty (Easy, Medium or Hard)');
    if (name == null || diff == null || type == null) return;
    
    axios({
      method: "post",
      url: URL + "/addSet",
      data: {
        title: name,
        type: type,
        difficulty: diff,
        status: "Locked"
      }
    }).then(e => {
      setPprId(e.data);
      paperLoad(e.data);
    });
  }

  const showAllQuestions = () => {
    paperLoad("all");
    setPmode(true);
  }

  const newQuestion = (que) => {
    reset();
    axios({
      method: "POST",
      data: {
        title: que.title,
        description: que.description,
        input: que.input,
        output: que.output,
        sol: que.sol
      },
      url: URL + "/question"
    }).then(() => {
      paperLoad("all");
      setPmode(true);
    }).catch(e => console.log(e));
  }

  const showAllSets = () => {
    paperLoad("all");
    setPmode(false);
    setPushDb(true);

    var config = {
      method: 'get',
      url: URL+"/allSets"
    };
    
    axios(config)
      .then(function (response) {
        setQuesPprArr(response.data);
      });
  }
  const pushq = () => {
    axios({
      method: "POST",
      data: {
        titleId: pprId,
        questionId: queId
      },
      url: URL + "/addQuestion"
    }).then(() => {
      alert("Question added successfully!!!");
      setPprId(-1);
      setQueId(-1);
    });
  }

  return (
    <div className="App">
      <label for="selectList">Choose a Set:</label>
      <select
        value={pprId}
        onChange={(e) => paperLoad(e.target.value)}
        name="selectList"
        className="form-control w-100"
        id="selectList"
      >
        <option value={-1}>Select a set</option>
        {quesPprArr.map((m, i) => (
          <>
            <option value={m._id}>{m.title} - {m.type} set</option>
          </>
        ))}
      </select>

      <button className='btn btn-primary' onClick={showAllQuestions}>View All Questions</button>
      <button className='btn btn-primary' onClick={newSet}>Add new set</button>
      <button className='btn btn-primary' onClick  = {()=>setPmode(false)}>Add a question</button>
      <button className='btn btn-primary' onClick={showAllSets}>Push Question To a Set</button>

      {
        pmode === true ?
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {
              quesArr.map(m =>
                <>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                      <button
                        onClick={(e) => { setAccOpen(m._id); e.preventDefault() }}
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="show"
                        aria-expanded="false"
                      >
                        <strong>{m.title}</strong>
                      </button>
                    </h2>
                    
                    <div id={"flush-collapseOne"} className={"accordion-collapse collapse" + (m._id === accOpen ? "show" : "")} >
                      <div className="accordion-body float-left">
                        <p className='text-left prew'>
                          <u>
                            Description: 
                          </u><br />
                          {m.description}<br />
                          <u>
                            Input: 
                          </u><br />
                          {m.input}<br />
                          <u>
                            Output: 
                          </u><br />
                          {m.output}<br />
                          <u>
                            Solution: 
                          </u><br />
                          {m.sol}<br />
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )
            }
          </div> :
          pushDb === true ?
            <div>
              <label for="SetList">Choose a Set:</label>
              <select
                value={pprId}
                onChange={e => setPprId(e.target.value)}
                name="SetList"
                className="form-control w-100"
                id="SetList"
              >
                <option value={-1}>Select a set</option>
                {quesPprArr.map((m, i) => (
                  <>
                    <option value={m._id}>{m.title} - {m.type} set</option>
                  </>
                ))}
              </select>
            
              <label for="QueList">Choose a Question:</label>
              <select
                value={queId}
                onChange={e => setQueId(e.target.value)}
                name="QueList"
                className="form-control w-100"
                id="QueList"
              >
                <option value={-1}>Select a question</option>
                {quesArr.map((m, i) => (
                  <>
                    <option value={m._id}>{m.title}</option>
                  </>
                ))}
              </select>

              <button className='btn btn-primary w-25' onClick={pushq}>
                  Add to Set
              </button>
            </div> :
            <form
              className="form-group w-100  col-md-offset-6"
              onSubmit={
                handleSubmit(que => {
                  newQuestion(que);
                })}
            >
              <Input lbl="title" reg={register}></Input>
              <Input lbl="description" reg={register}></Input>
              <Input lbl="input" reg={register}></Input>
              <Input lbl="output" reg={register}></Input>
              <Input lbl="sol" reg={register}></Input>
              
              <button
                className='form-control btn btn-primary w-25'
                type='submit'
              >
                Add
              </button>
              <button
                className='form-control btn btn-primary w-25'
                onClick={() => reset()}
              >
              Clear Form
              </button>
              <button className='form-control btn btn-danger w-25' onClick={() => setPmode(true)}>
                Cancel
              </button>
            </form>
      }
    </div>
  );
}

export default App;
