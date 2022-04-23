import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import Input from './Input';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios'
function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const paperLoad = (e)=>{
    if(e ==-1)return;
    var config = {
      method: 'get',
      url: 'http://localhost:3004/showPy/'+e,
  
    };
    
    axios(config)
    .then(function (response) {
      setQuesArr(response.data);
      console.log(response.data)
      setPprId(e)
      setQuesArrT([]);
    })
   
  
  // console.log(e.target.value);
  
  }
  
  const [quesPprArr,setQuesPprArr]  = useState([]);
  const [quesArr,setQuesArr]  = useState([]);
  const [quesArrT,setQuesArrT]  = useState([]);
  const [pprId,setPprId] = useState();
  const [pmode,setPmode] = useState(true);
  const [accOpen , setAccOpen]  = useState(-1);
  const [a,setQ]  = useState("");
  useEffect(() => {
    var config = {
      method: 'get',
      url: 'http://localhost:3004/showPy',

    };
    
    axios(config)
    .then(function (response) {
      setQuesPprArr(response.data);
      console.log(response.data)
      
    })
  
    return () => {
     
    }
  }, [])
const URL = "http://localhost:3004/"
  const pushq=()=>{
    axios({
      method: "post",
      url: URL + "addPyQuestions/"+ pprId,
      data: {
      
        obj: quesArrT,
      },
    }).then((res)=>paperLoad(pprId)).catch(e=>console.log(e))
  }
 


const delQ=()=>{
  axios({
    method: "delete",
    url: "http://localhost:3004/pyQues/"+ accOpen,
   
  }).then(e=>{paperLoad(pprId);
  console.log("deleted");}

    )
}
const delP=()=>{
  axios({
    method: "delete",
    url: "http://localhost:3004/pyPaper/"+ pprId,
   
  }).then(e=>
    setPprId(-1))
} 


const newP =()=>{
  var name = prompt("enter paper name");
  var diff = prompt('enter difficulty')
if(name==null || diff == null)return ;
  axios({
    method: "post",
    url: "http://localhost:3004/createPyPaper/"+name+"?difficulty="+diff,
   
  }).then(e=>{
    setPprId(e.data)
    paperLoad(e.data);
    console.log(e.data,"pprid");

    var config = {
      method: 'get',
      url: 'http://localhost:3004/showPy',

    };
    
    axios(config)
    .then(function (response) {
      setQuesPprArr(response.data);
      console.log(response.data)
      
    })

  })
}
return (
    <div className="App">
      {/* {quesArr.map(m=><pre>{m}</pre>)} */}
      <select value = {pprId}
      onChange = {(e)=>paperLoad(e.target.value)}
        name="selectList"
        className="form-control w-100"
        id="selectList"
        // onChange={(e) => {
        //   set(e.target.value);
        // }}
      >
         <option  value={-1}>select one paper</option> 
        {quesPprArr.map((m, i) => (
          <>
            <option value={m._id}>{m.papername}</option>
          </>
        ))}
      </select>
      <button className='btn btn-primary' onClick={newP}>Add new set</button>
      <button className='btn btn-primary' onClick  = {()=>setPmode(false)}>Add a question</button>
      <button className='btn btn-primary' onClick={pushq}>Push Questions To Database</button>
      <button className='btn btn-danger' onClick={delP}>Delete this paper</button>

      <pre>{JSON.stringify(quesArr)}</pre>
 {
pmode === true


?


<div class="accordion accordion-flush" id="accordionFlushExample">
      {
 
 quesArr.map(m=><>
        <div class="accordion-item">
 <h2 class="accordion-header" id="flush-headingOne">
      <button onClick={(e)=>{setAccOpen(m._id);e.preventDefault()}} class="accordion-button collapsed" type="button" data-bs-toggle="show"  aria-expanded="false">
      {m.description}
      </button>
    </h2>
    <div id={"flush-collapseOne"} class={"accordion-collapse collapse" +(m._id==accOpen?"show":"")} >
      <div class="accordion-body float-left">
        <button onClick={delQ} className='btn btn-danger'>Delete</button>
     <h5 class='text-left prew'>{m.description}<br/>{m.input}<br/>{m.sol}<br/>{m.output}<br/></h5>
      </div>
    </div>
  </div>
      </>)
    }
        {
      quesArrT.map((m,i)=><>
        <div class="accordion-item bg-success">
 <h2 class="accordion-header" id="flush-headingOne">
      <button onClick={(e)=>{setAccOpen(i);e.preventDefault()}} class="accordion-button collapsed" type="button" data-bs-toggle="show"  aria-expanded="false">
      {m.description}
      </button>
    </h2>
    <div id={"flush-collapseOne"} class={"accordion-collapse collapse" +(i==accOpen?"show":"")} >
      <div class="accordion-body float-left">
        <button  className='btn btn-danger'>Delete</button>
     <h5 class='text-left prew'>{m.description}<br/>{m.input}<br/>{m.sol}<br/>{m.output}<br/></h5>
      </div>
    </div>
  </div>
      </>)
    }

</div>
:
<form className="form-group w-100  col-md-offset-6" onSubmit={handleSubmit(e=>{setQuesArrT(p=>[...p,{...e,uid:pprId}]);setPmode(true)})}>
 
<Input lbl = "title" reg  = {register}></Input>
<Input lbl = "description" reg  = {register}></Input>
<Input lbl = "input" reg  = {register}></Input>
<Input lbl = "output" reg  = {register}></Input>
<Input lbl = "sol" reg  = {register}></Input>

<button className='form-control btn btn-primary w-25' type = "submit">Add</button>
<button className='form-control btn btn-danger w-25' onClick = {()=>setPmode(true)}>Cancel</button>



</form>
 }


     
 

 
    </div>
  );
}

export default App;
