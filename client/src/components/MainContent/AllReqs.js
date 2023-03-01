import { useEffect, useCallback, useContext, useState } from "react";
import io from "socket.io-client";
import AuthContext from "../../store/auth-context";
import ReqItem from "../ReqItem/ReqItem";
import axios from "axios";

const socket = io.connect("http://localhost:1234");

const AllReqs = (props) => {
  const [allReqs, setAllReqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [limit, setLimit] = useState(50);

  const authCtx = useContext(AuthContext);
  const filters = props.filters;

  useEffect(() => {
    socket.on("reqAdded", () => {
      getReqs();
    });

    socket.on("reqUpdate", () => {
      getReqs();
    });
  }, [socket]);

  const getReqs = useCallback(async () => {
    let url = "api/reqs?";
    if (filters) {
      for (const key in filters) {
        url = `${url}${key}=${filters[key]}&`;
      }
    }
    url = `${url}limit=${limit}`;
    try {
      setIsLoading(true);
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      });
      setIsAvailable(res.data.more);
      const data = res.data.reqs;
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
          declineReason: data[key].declineReason,
          owner: data[key].owner.email,
          time: data[key].time,
        });
      }
      setAllReqs(loadedReqs);
    } catch (e) {
      console.log(e.message);
    }
  }, [filters, limit]);

  useEffect(() => {
    getReqs();
  }, [getReqs]);

  const reqOpenHandler = (isOpen, reqid, declineReason) => {
    props.reqOpenHandler(isOpen, reqid, declineReason);
  };

  const clickHandler = () => {
    setLimit((prevState) => prevState + 50);
  };

  return (
    <>
      <ul>
        {isLoading && <p>טוען...</p>}
        {allReqs.map((req) => {
          return (
            <ReqItem
              key={req.key}
              headline={req.headline}
              reason={req.reason}
              isApproved={req.isApproved}
              isOpen={req.isOpen}
              onReqOpen={reqOpenHandler.bind(
                null,
                req.isOpen,
                req.id,
                req.declineReason
              )}
              isFullScreen={props.isFullScreen}
              isAdminPage={true}
              time={req.time}
              by={req.owner}
              class="double-item"
            />
          );
        })}
        {isAvailable && <button onClick={clickHandler}>טען עוד</button>}
      </ul>
    </>
  );
};

export default AllReqs;
