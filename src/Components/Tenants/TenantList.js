import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'

const TenantList = props => {
    const [currentTenants, setCurrentTenants] = useState([])
    const [addresses, setAddresses] = useState([])
    const [admin, setAdmin] = useState(true)
    const [editBool, setEditBool] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [propId, setPropId] = useState()
    const [buttonId, setButtonId] = useState()
    const [petBool, setPetBool] = useState()

    useEffect(() => {
      setAdmin(props.admin)
    }, [])
  
    useEffect(() => {
        console.log(admin)
    //   if (admin === false) {
    //     return ('You do not have access to this data.')
    //   } else
       if (admin === true) {
        axios.get('/api/manager/tenants/true')
          .then(res => {
            console.log(res.data)
            setCurrentTenants(res.data)
          })
          .catch(err => console.log(err))
        axios.get('/api/manager/properties')
        .then(res => {
            setAddresses(res.data)
        })
        .catch(err => console.log(err))
      }
    }, [])

    function clickEdit(id) {
        setEditBool(true)
        setButtonId(id)
    }

    function submit(element) {
        console.log('approval' + element.approved)
        axios.put(`/api/manager/tenants/${element.user_id}`, {
            first_name: firstName !== '' ? firstName : element.first_name,
            last_name: lastName !== '' ? lastName : element.last_name,
            phone: phone !== '' ? phone : element.phone,
            email: email !== '' ? email : element.email,
            pet: petBool === true ? petBool : element.pet,
            approved: element.approved,
            prop_id: propId !== '' ? propId : element.prop_id
        })
        .then(res => {
            setCurrentTenants(res.data)
              setEditBool(false)
              setFirstName('')
              setLastName('')
              setPhone('')
              setEmail('')
              setPetBool()
              setPropId()
              console.log(firstName, phone)
            axios.get('/api/manager/tenants/true')
            .then(res => {
              
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    function mapIt(array) {
        let currentAddress
        return array.map((element) => {
            for (let i = 0; i < addresses.length; i++) {
               if (element.prop_id === addresses[i].prop_id) {
                currentAddress = addresses[i].address
            }  
        }
           
          return (
            <div key={element.user_id}>
            <button onClick={() => clickEdit(element.user_id)}>Edit</button>
              {editBool === false ? (
                <div>
                    <div>{element.user_id}</div>
                    <div>{`${element.first_name} ${element.last_name}`}</div>
                    <div>{currentAddress}</div>
                    <div>{element.email}</div>
                    <div>{element.phone}</div>
                    {element.pets === true ? <div>Yes</div> : <div>No</div>}
                    <div>{element.due_date}</div>
                </div>
                ) : (
                    element.user_id === buttonId ? (
                    <div>
                        <div>{element.user_id}</div>
                        <input defaultValue={`${element.first_name}`} onChange={e => setFirstName(e.target.value)}></input>
                        <input defaultValue={`${element.last_name}`} onChange={e => setLastName(e.target.value)}></input>
                        <input defaultValue={element.prop_id} onChange={e => setPropId(e.target.value)}></input>
                        <input defaultValue={element.email} onChange={e => setEmail(e.target.value)}></input>
                        <input defaultValue={element.phone} onChange={e => setPhone(e.target.value)}></input>
                        <input type='radio' defaultValue={element.pet} onClick={petBool === true ? () => setPetBool(false) : () => setPetBool(true)}></input>
                        {/* <input defaultValue={element.approved} onchange={e => setApproved(e.targetValue)}></input> */}
                        <button className='submit' onClick={() => submit(element)}>Save</button>
                     </div>
                    ) : (
                        <div>
                            <div>{element.user_id}</div>
                            <div>{`${element.first_name} ${element.last_name}`}</div>
                            <div>{currentAddress}</div>
                            <div>{element.email}</div>
                            <div>{element.phone}</div>
                            {element.pets === true ? <div>Yes</div> : <div>No</div>}
                            <div>{element.due_date}
                        </div>
                </div> 
                    )
                )
              }
            </div>
          )
        })
      }

    return (
        <div className='maint-req'>
            {mapIt(currentTenants)}
        </div>
    )
}

function mapStateToProps(state) {
    console.log('state:', state)
    return {
      email: state.email,
      user_id: state.user_id,
      admin: state.admin,
      approved: state.approved
    }
}

export default connect(mapStateToProps)(TenantList)