import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "./icon";
import MarkerPosition from "./MarkerPosition";
import Lottie from "lottie-react";
import map from "../../src/lotties/map.json";
const apiKey = process.env.API_KEY;
// https://geo.ipify.org/api/v2/country,city?apiKey=at_ob0XfcMXzM67QmVGSwjdBTNncd6WB&ipAddress=8.8.8.8
const HomePage = () => {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  // const map =useMap();
  useEffect(() => {
    try {
      console.log(process.env.API_KEY);
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_ob0XfcMXzM67QmVGSwjdBTNncd6WB&ipAddress=8.8.8.8`
        );
        const data = await res.json();
        setAddress(data);
        console.log(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  async function getEnteredAddress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_ob0XfcMXzM67QmVGSwjdBTNncd6WB&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredAddress();
    setIpAddress("");
  };

  return (
    <div>
      <div className="xl:flex  items-center w-full xl:h-[100vh] bg-[#abd1c6]">
        <div className="left xl:w-1/2 h-fit">
          <div className="flex items-center justify-center">
            <Lottie
              animationData={map}
              loop={true}
              style={{ width: 350, height: 350 }}
            />
          </div>

          <div className="Ip ">
            <p className="text-[32px] font-semibold text-[#001e1d]">
              IP Address Tracker
            </p>
          </div>
          <div className="searchbar mt-10 w-full ">
            <form
              onSubmit={handleSubmit}
              autoComplete="off "
              className="flex items-center justify-center"
            >
              <input
                type="search"
                name="ipaddress"
                id="ipaddress"
                required
                placeholder="Search for any IP address or domain"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                autoComplete="off"
                className="w-[60%] h-12 rounded-l-[12px] outline-none p-3 border-solid text-xs md:text-sm xl:text-md"
              />
              <div className="h-12 flex items-center justify-center text-[28px] w-10 bg-[#f9bc60] rounded-r-[12px]">
                <button type="submit">{`>`}</button>
              </div>
            </form>
            {address && (
              <>
                <div className="flex flex-col xl:flex-row   mt-10 items-center justify-center mb-10">
                  <div className="div flex flex-col xl:flex-row gap-10 w-[40%] xl:w-[90%] items-center justify-between bg-[#004643] xl:h-36 rounded-[24px] text-[#f9bc60] py-10 xl:py-0 xl:px-10 text-[12px] md:text-[18px] font-semibold">
                    <div className="first flex flex-col gap-3 md:gap-5  ">
                      <p className="text-[16px] md:text-[22px] text-[#fffffe]"> IP address</p>
                      <p>{address.ip}</p>
                    </div>
                    <div className="second  flex flex-col gap-3 md:gap-5">
                      <p className="text-[16px] md:text-[22px] text-[#fffffe]">Location</p>
                      <p>
                        {address.location.city},{address.location.region}
                      </p>
                    </div>
                    <div className="third  flex flex-col gap-3 md:gap-5">
                      <p className="text-[16px] md:text-[22px] text-[#fffffe]">Timezone</p>
                      <p>UTC {address.location.timezone}</p>
                    </div>
                    <div className="fourth  flex flex-col gap-3 md:gap-5">
                      <p className="text-[16px] md:text-[22px] text-[#fffffe]">ISP</p>
                      <p>{address.isp}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="right xl:w-1/2">
          {address && (
            <>
              <div className="map h-[100vh]">
                <MapContainer
                  center={[address.location.lat, address.location.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MarkerPosition address={address} />
                </MapContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
