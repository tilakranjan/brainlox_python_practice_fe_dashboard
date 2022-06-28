import './App.css';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import Input from './Input';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import Swal from "sweetalert2";

function App() {
  const {
    register,
    handleSubmit,
    reset
  } = useForm();
  
  const [quesPprArr,setQuesPprArr]  = useState([]);
  const [quesArr,setQuesArr]  = useState([]);
  const [pprId, setPprId] = useState();
  const [queId, setQueId] = useState();
  const [pmode, setPmode] = useState(true);
  const [pushDb, setPushDb] = useState(false);
  const [accOpen , setAccOpen]  = useState(-1);

  const URL = "https://cryptic-crag-63552.herokuapp.com/python/dashboard";

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
   
  const newSet = () => {
    
    Swal.fire({
      title: 'Add a Set',
      html: `<label for="name">Set Name</label> 
      <input type="text" id="name" class="swal2-input" placeholder="Set Name">
      <label for="type">Set Type</label> 
      <select id="type" class="swal2-input">
        <option value="problem">Problem</option>
        <option value="workshop">Workshop</option>
      </select> <br/>
      <label for="diff">Set Difficulty</label>
      <select id="diff" class="swal2-input">
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>`,
      confirmButtonText: 'Add',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value
        const type = Swal.getPopup().querySelector('#type').value
        const diff = Swal.getPopup().querySelector('#diff').value
        if (!name || !type || !diff) {
          Swal.showValidationMessage(`Please enter all the details`)
        }
        return { name: name, type: type, diff: diff }
      }
    }).then((result) => {
      axios({
        method: "post",
        url: URL + "/addSet",
        data: {
          title: result.value.name,
          type: result.value.type,
          difficulty: result.value.diff,
          status: "Locked"
        }
      }).then(e => {
        setPprId(e.data);
        paperLoad(e.data);
        Swal.fire({
          icon: 'success',
          title: 'Set added successfully'
        });
      });
    })
    
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
    
      <div className='App-header'>
        <h1> Dashboard </h1>
      </div>
      
      <div className='navOptions'>
        <button className='btn btn-primary' onClick={showAllQuestions}>View All Questions</button>
        <button className='btn btn-primary' onClick={newSet}>Add new set</button>
        <button className='btn btn-primary' onClick={() => { setPmode(false); setPushDb(false); }}>Add a question</button>
        <button className='btn btn-primary' onClick={showAllSets}>Push Question To a Set</button>
      </div>
      
      {
        pmode === true ?
          <div>
            <div className='selectList'>
              <label className='listLabel' for="selectList">Choose a Set</label>
              <select
                value={pprId}
                onChange={(e) => paperLoad(e.target.value)}
                name="selectList"
                className="listOptions"
                id="selectList"
              >
                <option value={-1}>Select a set</option>
                {quesPprArr.map((m, _i) => (
                  <>
                    <option value={m._id}>{m.title} - {m.type} set</option>
                  </>
                ))}
              </select>
            </div>

            <div className="accordion accordion-flush questionList" id="accordionFlushExample">
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
                      
                      <div id={"flush-collapseOne"} className={"question accordion-collapse collapse" + (m._id === accOpen ? "show" : "")} >
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
            </div>
          </div>
           :
          pushDb === true ?
            <div className='pushDB'>
              <div className='list'>
                <label className='inputLabel' for="SetList">Choose a Set</label>
                <select
                  value={pprId}
                  onChange={e => setPprId(e.target.value)}
                  name="SetList"
                  className="inputOption"
                  id="SetList"
                >
                  <option value={-1}>Select a set</option>
                  {quesPprArr.map((m, _i) => (
                    <>
                      <option value={m._id}>{m.title} - {m.type} set</option>
                    </>
                  ))}
                </select>
              </div>
              
              <div className='list'>
                <label className='inputLabel' for="QueList">Choose a Question</label>
                <select
                  value={queId}
                  onChange={e => setQueId(e.target.value)}
                  name="QueList"
                  className="inputOption"
                  id="QueList"
                >
                  <option value={-1}>Select a question</option>
                  {quesArr.map((m, _i) => (
                    <>
                      <option value={m._id}>{m.title}</option>
                    </>
                  ))}
                </select>
              </div>

              <button className='questionBtn' onClick={pushq}>
                  Add to Set
              </button>
            </div> :
            <form
              className="inputForm form-group col-md-offset-6"
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
              
              <div className='navOptions'>
                <button
                  className='questionBtn'
                  type='submit'
                >
                  Add
                </button>
                <button
                  className='questionBtn'
                  onClick={() => reset()}
                >
                Clear Form
                </button>
                <button className='btn btn-danger questionBtn' onClick={() => setPmode(true)}>
                  Cancel
                </button>
              </div>
              
            </form>
      }
    </div>
  );
}

export default App;
