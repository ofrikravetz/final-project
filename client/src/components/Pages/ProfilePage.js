import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import AuthContext from "../../store/auth-context";
import Declined from "../ReqItem/Declined";

import Profile from "../MainContent/Profile";

const ProfilePage = () => {
  const authCtx = useContext(AuthContext);
  const [allReqs, setAllReqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isReqOpen, setIsReqOpen] = useState(undefined);
  const [reqId, setReqId] = useState(undefined);

  const reqOpenHandler = (reqOpen, reqid) => {
    if (!isOpen) {
      setIsReqOpen(reqOpen);
    } else {
      setIsReqOpen(undefined);
    }
    setIsOpen(!isOpen);
    setReqId(reqid);
  };

  const getReqs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("api/user/bmreqs", {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      });
      const data = res.data;
      setIsLoading(false);

      const loadedReqs = [];

      for (const key in data) {
        loadedReqs.push({
          id: data[key]._id.toString(),
          key: key,
          headline: data[key].headline,
          reason: data[key].reason,
          isApproved: data[key].isApproved,
          isOpen: data[key].isOpen,
          owner: data[key].owner,
          time: data[key].time
        });
      }

      setAllReqs(loadedReqs);
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  useEffect(() => {
    getReqs();
  }, [getReqs]);

  return (
    <>
      <Profile allreqs={allReqs} isLoading={isLoading} onReqOpen={reqOpenHandler} />
      {isOpen && <Declined onReqOpen={reqOpenHandler} isOpen={isReqOpen} reqId={reqId} />}
    </>
  );
};

export default ProfilePage;
