import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import API_URL from "../../../config";

function convertDate() {
  var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

const AddComment = ({ partyCode }) => {
  const [formData, setFormData] = useState({
    partyComment: "",
    commentDate: convertDate(),
    partyCode: partyCode,
  });
  const [errMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/dealers/${partyCode}`)
      .then((response) => {
        setCommentsList(response.data.comments);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [partyCode]);

  const handleChange = (event) => {
    const formDataCopy = { ...formData };
    if (event.hasOwnProperty("target")) {
      formDataCopy[event.target.name] = event.target.value;
    }
    setFormData(formDataCopy);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    axios.post(`${API_URL}/dealers/addcomment`, formData)
      .then((response) => {
        if (response.data) {
          setSuccessMsg("Comment Added Successfully !!");
          window.location.reload();
        }
      });
  }
  return (
    <>
      <div className="row justify-content-center newtrans-main mt-4">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <Form onSubmit={onSubmit}>
            <div className="commentdate transaction-date mt-5">
              <div>Date:</div>
              <input
                required
                className="ml-2 date-picker"
                type="date"
                name="commentDate"
                onChange={handleChange}
                value={formData["commentDate"]}
              />
            </div>
            <Form.Group className="col-md-12 d-flex justify-content-center align-items-center mt-3">
              <Form.Control
                required
                className="transaction-fields"
                type="text"
                placeholder="Enter Comments"
                name="partyComment"
                onChange={handleChange}
                value={formData["partyComment"]}
              />
              <Button variant="primary" type="submit" className=""> + </Button>
            </Form.Group>
            {
              successMsg && <div className="mb-3 ml-4"><span className="success-msg">{successMsg}</span></div>
            }
          </Form>
          {errMsg !== "" && <div className="form-err-txt mt-4">{errMsg}</div>}
        </div>
        <div className="row partycomments-main">
          <div className="col-md-12">
            {
              commentsList.length > 0 && commentsList.map((item, inx) => {
                return (
                  <div className="comment-text" key={`partycomment_${inx}`}><span className="comment-date">{item.createdAt ? item.createdAt.toString().slice(0, 10) : ''}</span>{item.comment}</div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};
export default AddComment;
