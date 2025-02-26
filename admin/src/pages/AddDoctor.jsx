import React from 'react'

const AddDoctor = () => {
  return (
    <div>
      <div>
      <div>
        <form>
            <label for="doc_name">Name:</label>
            <input type="text" name="docname"  required/>
            <br></br>
            <label for="doc_ph_number">Mobile No:</label>
            <input type="number" name="docnumber"  required/>
            <br></br>
            <label for="doc_id">Id:</label>
            <input type="text" name="docid"></input>
            <br></br>
            <button>Submit</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default AddDoctor