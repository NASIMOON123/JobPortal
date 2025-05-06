
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import "./Application.css";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const acceptApplication = (id) => {
    try {
      axios
        .patch(`http://localhost:4000/api/v1/application/accept/${id}`, {}, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplications) =>
            prevApplications.map((app) =>
              app._id === id ? { ...app, status: "Accepted" } : app
            )
          );
  
          // Fetch the application details from the updated state
          const applicant = applications.find((app) => app._id === id);
          if (applicant) {
            sendAcceptanceEmail(applicant.email, applicant.name);
          }
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

  
  const rejectApplication = (id) => {
    try {
      axios
        .patch(`http://localhost:4000/api/v1/application/reject/${id}`, {}, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplications) =>
            prevApplications.map((app) =>
              app._id === id ? { ...app, status: "Rejected" } : app
            )
          );
  
          // Fetch the application details from the updated state
          const applicant = applications.find((app) => app._id === id);
          if (applicant) {
            sendAcceptanceEmail(applicant.email, applicant.name);
          }
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <center>
            <h1>My Applications</h1>
          </center>
          {applications.length <= 0 ? (
            <>
              <center>
                <h4>No Applications Found</h4>
              </center>
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                  acceptApplication={acceptApplication}
                  rejectApplication={rejectApplication}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <center>
            <h1>Applications From Job Seekers</h1>
          </center>
          {applications.length <= 0 ? (
            <>
              <center>
                <h4>No Applications Found</h4>
              </center>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                  acceptApplication={acceptApplication}
                  rejectApplication={rejectApplication}
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({
  element,
  deleteApplication,
  openModal,
 
}) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
          {/* {element.status !== "Accepted" && element.status !== "Rejected" && (
            <>
              <button
                className="accept-btn"
                onClick={() => acceptApplication(element._id)}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => rejectApplication(element._id)}
              >
                Reject
              </button>
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({
  element,
  openModal,
  acceptApplication,
  rejectApplication
}) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
          <button
            className="accept-btn"
            onClick={() => acceptApplication(element._id)}
          >
            Accept
          </button>
          <button
            className="reject-btn"
            onClick={() => rejectApplication(element._id)}
          >
            Reject
          </button>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          {element.status !== "Accepted" && element.status !== "Rejected" && (
            <>
              {/* Optionally add more buttons if needed */}
            </>
          )}
        </div>
      </div>
    </>
  );
};



