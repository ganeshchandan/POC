import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Cards from "./cards";
import { RootState } from "./store";
import { useEffect } from "react";
import { updateServiceWorkerUpdate } from "./reducer/service_worker";

const Msg = () => (
  <div
    style={{
      position: "fixed",
      zIndex: 1,
      background: "#fAFAFA",
      top: "17px",
      padding: "20px",
      right: "20px",
      borderRadius: "10px",
    }}
  >
    <p> Update available, Please refresh your browser!</p>
    <div>
      <span>From PCs: Press Ctrl + Shift + R....</span>
      <span color="primary">
        From Mobile Phones: Close all your opened tabs....
      </span>
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const serviceWorkerUpdated = useSelector(
    (state: RootState) => state.serviceWorker.serviceWorkerUpdated
  );

  useEffect(() => {
    if (serviceWorkerUpdated) {
      setTimeout(() => dispatch(updateServiceWorkerUpdate(false)), 2000);
    }
    return () => {};
  }, [serviceWorkerUpdated]);

  return (
    <>
      {serviceWorkerUpdated && <Msg />}
      <span>TEST</span>
      <Cards />
    </>
  );
};

export default App;
