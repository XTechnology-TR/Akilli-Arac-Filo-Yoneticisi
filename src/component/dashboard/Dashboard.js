import React, { useState } from "react";
import { db } from "../firebase/fireConfig";
import HeaderLayout from "../dashboard_common/HeaderLayout";
import FooterLayout from "../dashboard_common/FooterLayout";
import SpeedLog from "../Logs/SpeedLog";
import FuelLog from "../Logs/FuelLog";
import FuelRefillLog from "../Logs/FuelRefillLog";
import MaintainenceLog from "../Logs/MaintainenceLog";
import OverSpeedLog from "../Logs/OverSpeedLog";
import { Layout, Menu, Breadcrumb, Divider } from "antd";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
} from "mdbreact";
import {
  DesktopOutlined,
  PieChartOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import "./Dashboard.css";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";

function Dashboard() {
  // Layout and Menu
  const { Content, Sider } = Layout;
  const { SubMenu } = Menu;

  // vehicleId & vehicleName for addVehicle
  const [vehicleNAME, setVehicleNAME] = useState("");
  const [vehicleID, setVehicleID] = useState("");

  // vehicleName, dateTime & cost for maintenace
  const [vehicleRegNumber, setVehicleRegNumber] = useState("");
  const [date, setDate] = useState(moment().toString());
  const [cost, setCost] = useState("");

  // set date
  const onDateChange = (val) => {
    setDate(val);
  };

  const [collapseState, setCollapseState] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapseState({ collapsed });
  };

  // form onSubmit handler
  const submitHandler = (event) => {
    event.preventDefault();
    event.target.className += " was-validated";
  };

  // form vehicleRegister submitHandler
  const vehicleRegister = (event) => {
    if (vehicleID && vehicleNAME) {
      // check if the doc are already available in the DB... then just give the warning to the user!

      // create a doc in DB with vehicleID and set it fields
      db.collection("data").doc(vehicleID).set({
        vehicleId: vehicleID,
        vehicleName: vehicleNAME,
      });

      // create a dummy collection for newly created vehicleID
      db.collection("data").doc(vehicleID).collection("fuel").doc().set({
        id: "0",
        amount: "0",
        timestamp: "0",
      });
      db.collection("data").doc(vehicleID).collection("fuel_refill").doc().set({
        id: "0",
        amount: "0",
        timestamp: "0",
      });
      db.collection("data")
        .doc(vehicleID)
        .collection("maintainance")
        .doc()
        .set({
          id: "0",
          amount: "0",
          timestamp: "0",
        });
      db.collection("data").doc(vehicleID).collection("overspeed").doc().set({
        id: "0",
        speed: "0",
        timestamp: "0",
      });
      db.collection("data").doc(vehicleID).collection("speed").doc().set({
        id: "0",
        speed: "0",
        timestamp: "0",
      });

      // success mgs for the all are right
      alert("Vehicle added successfully..!!!");

      // set it to defualt to state
      setVehicleNAME("");
      setVehicleID("");
    } else {
      alert("Both the fields are mandatory!!!");
    }
  };

  // from vehicleMaintenace submitHandler
  const addCost = (event) => {
    // store maintainance-cost into database
    db.collection("data")
      .doc(vehicleRegNumber)
      .collection("maintainance")
      .add({
        id: vehicleRegNumber,
        cose: cost,
        timestamp: date,
      })
      .then(function () {
        // success mgs for the all are right
        alert("Vehicle maintainance added successfully..!!!");
      })
      .catch(function (error) {
        console.error("Error writing maintainance module", error);
      });
  };

  // render() {
  return (
    <Layout>
      {/* Header Section */}
      <HeaderLayout className="header" />
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapseState.collapsed}
          onCollapse={onCollapse}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["stats"]}
            defaultOpenKeys={["track"]}
            mode="inline"
          >
            <Menu.Item key="stats" icon={<PieChartOutlined />}>
              Stats
            </Menu.Item>
            <SubMenu key="track" icon={<DesktopOutlined />} title="Track">
              <Menu.Item key="speed">Speed</Menu.Item>
              <Menu.Item key="fuel">Fuel</Menu.Item>
              <Menu.Item key="fuel_refill">Fuel Refill</Menu.Item>
              <Menu.Item key="overspeeding">OverSpeeding</Menu.Item>
              <Menu.Item key="maintainance">Maintainance</Menu.Item>
            </SubMenu>
            <Menu.Item key="addVehicle" icon={<AppstoreAddOutlined />}>
              Add Vehicle
            </Menu.Item>
            <Menu.Item key="addMaintainance" icon={<AppstoreAddOutlined />}>
              Add Maintainance
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Breadcrum Naming */}
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Abhishek</Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 560 }}
            >
              {/* Speed Section */}
              <Divider orientation="left">Speed area</Divider>
              <MDBContainer>
                <SpeedLog />
              </MDBContainer>

              {/* Fuel Section */}
              <Divider orientation="left">Fuel area</Divider>
              <MDBContainer>
                <MDBRow>
                  <FuelLog />
                </MDBRow>
              </MDBContainer>

              {/* OverSpeeding Section */}
              <Divider orientation="left">OverSpeeding area</Divider>
              <MDBContainer>
                <MDBRow>
                  <OverSpeedLog />
                </MDBRow>
              </MDBContainer>

              {/* Fuel Refill Section */}
              <Divider orientation="left">Fuel Refill area</Divider>
              <MDBContainer>
                <MDBRow>
                  <FuelRefillLog />
                </MDBRow>
              </MDBContainer>

              {/* Maintainence Section */}
              <Divider orientation="left">Maintainance area</Divider>
              <MDBContainer>
                <MDBRow>
                  <MaintainenceLog />
                </MDBRow>
              </MDBContainer>

              {/* addVehicle Section */}
              <Divider orientation="left">Add Vehicle</Divider>
              <MDBContainer>
                <MDBRow>
                  <MDBCol md="6">
                    <form
                      className="needs-validation"
                      onSubmit={submitHandler}
                      noValidate
                    >
                      <p className="h5 text-center mb-4">Register Vehicle</p>
                      <div className="grey-text">
                        <MDBInput
                          className="addVehicle_vehicleNAME"
                          name="vehicleNAME"
                          onChange={(event) =>
                            setVehicleNAME(event.target.value)
                          }
                          value={vehicleNAME}
                          label="Your vehicle name"
                          icon="car"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                        <MDBInput
                          className="addVehicle_vehicleID"
                          name="vehicleID"
                          onChange={(event) => setVehicleID(event.target.value)}
                          value={vehicleID}
                          label="Your vechile reg. number"
                          icon="registered"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                      </div>
                      <div className="text-center">
                        <MDBBtn outline type="submit" onClick={vehicleRegister}>
                          Register
                          <MDBIcon className="ml-1" />
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCol>
                  <MDBCol md="6">
                    <form
                      className="needs-validation"
                      onSubmit={submitHandler}
                      noValidate
                    >
                      <p className="h5 text-center mb-4">
                        Register Maintainance
                      </p>
                      <div className="grey-text">
                        <MDBInput
                          className="addVehicle_vehicleNAME"
                          name="vehicleName"
                          onChange={(event) =>
                            setVehicleRegNumber(event.target.value)
                          }
                          value={vehicleRegNumber}
                          label="Your vehicle Reg number"
                          icon="registered"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                        <div>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              fullWidth
                              variant="inline"
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="date-picker-inline"
                              label="DD/MM/YYYY"
                              value={date}
                              onChange={onDateChange}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                        <MDBInput
                          className="addVehicle_vehicleID"
                          name="cost"
                          onChange={(event) => setCost(event.target.value)}
                          value={cost}
                          label="Your mainatenace cost..."
                          icon="rupee-sign"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                      </div>
                      <div className="text-center">
                        <MDBBtn outline type="submit" onClick={addCost}>
                          Add Cost
                          <MDBIcon className="ml-1" />
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>

              {/* End */}
            </div>
          </Content>
          <FooterLayout />
        </Layout>
      </Layout>
    </Layout>
  );
  // }
}

export default Dashboard;
