import axios from 'axios'
import React, {useState} from 'react'
import PropertiesList from '../Properties/PropertiesList'

const Properties = props => {
    const [admin, setAdmin] = useState(true)
    const [newPropertyDisplay, setNewPropertyDisplay] = useState(false)
    const [currentProperties, setCurrentProperties] = useState([])
    const [submitProperty, setSubmitProperty] = useState(false)
    const [address, setAddress] = useState('')
    const [leaseAmt, setLeaseAmt] = useState()
    const [leaseStatus, setLeaseStatus] = useState(null)

    function newProperty() {
        console.log('clicked')
        setSubmitProperty(false)
        setNewPropertyDisplay(true)          
    }

    function submit() {
        console.log('submitted')
        axios.post('/api/manager/properties', {
            address: address,
            leaseAmt: leaseAmt,
            status: leaseStatus !== null ? leaseStatus : false
        })
        .then(res => {
            setSubmitProperty(true)
            setNewPropertyDisplay(false)
            setAddress('')
            setLeaseAmt()
            setLeaseStatus(null)
            axios.get('/api/manager/properties')
            .then(res => {
                setCurrentProperties(res.data)
            })
            .catch(err => console.log(err))
        })
    }

    function checkbox(checkbox) {
        if (checkbox.checked === true) {
            setLeaseStatus(true)
        } else if (checkbox.checked === false){
            setLeaseStatus(false)
        }
    }

 return (
  <div>
      <div>
          <div>
            <h1>Current Properties</h1>
            <PropertiesList setCurrentProperties={setCurrentProperties} currentProperties={currentProperties}/>
          </div>
          <button className="submit" onClick={() => newProperty()}>New Property</button>
      </div>
      {newPropertyDisplay === true ? (
        <div>
            <div>
                <div>Address: </div>
                <input onChange={e => setAddress(e.target.value)}></input> 
            </div>
            <div>
                <div>Lease Amount: </div>
                <input onChange={e => setLeaseAmt(e.target.value)} placeholder='$'></input> 
            </div>
            <div>
                <input type='checkbox' name='leaseStatus' id='leaseStatus' onClick={() => checkbox(document.getElementById('leaseStatus'))}></input>
                <label htmlFor={'leaseStatus'}>Active Lease?</label>
            </div>
            <div>
                <button className='Submit' onClick={() => submit()}>Submit</button> 
            </div>
        
        </div>) : null}
  </div>
 )
}
export default Properties