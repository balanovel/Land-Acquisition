import React, { useEffect, useState } from 'react';
import './bottomdraw.css'; // Ensure this path is correct
import axios from 'axios';
import { AiTwotoneCloseSquare } from "react-icons/ai";

function Demo(Data) {
    const [showTable, setShowTable] = useState(false);
    const [status, setStatus] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [rows, setRows] = useState([]);
    const [salecomps, setsalecomps] = useState([]);
    const [rejectReason, setRejectReason] = useState(''); // State for input box
    const [data, setData] = useState([]);
    const [organizedData, setorganizedData] = useState([])// State for data fetched from API
    const [map, setmap] = useState([])
    const [web, setweb] = useState([])// State for data fetched from API
    const [rejectButton, setRejectButton] = useState(false)


    // States for ratings and remarks
    const [locationRating, setLocationRating] = useState('0');
    const [saleCompsRating, setSaleCompsRating] = useState('');
    const [soldCompsRating, setSoldCompsRating] = useState('');
    const [locationRemarks, setLocationRemarks] = useState('');
    const [saleCompsRemarks, setSaleCompsRemarks] = useState('');
    const [soldCompsRemarks, setSoldCompsRemarks] = useState('');



    useEffect(() => {
        setLocationRemarks(organizedData.item2?.location_remarks || '');
        setSaleCompsRemarks(organizedData.item2?.sale_comps_remarks || '');
        setSoldCompsRemarks(organizedData.item2?.sold_comps_remarks || '');
        setLocationRating(organizedData.item2?.location_rating || '');
        setSaleCompsRating(organizedData.item2?.sale_comps_rating || '');
        setSoldCompsRating(organizedData.item2?.sold_comps_rating || '');
    }, [organizedData]);
    // console.log("Data:",Data)
    const handleToggleTable = () => {
        setShowTable(prevShowTable => !prevShowTable);

    };

    const onClose = () => {
        setIsOpen(!isOpen);
    };

    const handleStarClick = (rating, name) => {
        if (name === 'sold_comps_rating') {
            setSoldCompsRating(rating);
        }
        else if(name === 'sale_comps_rating'){
            setSaleCompsRating(rating);
        }
        else if(name === 'location_rating'){
            setLocationRating(rating);

        }


       
        // setSoldCompsRating(rating);
    };
    // useEffect(() => {
    //     // setLocationRating(organizedData.item2?.location_rating || '');
    // }, [locationRating,soldCompsRating,saleCompsRating]);

    const addRow = () => {
        // Add a new empty row to the rows array


        setRows(prevRows => [...prevRows, {
            id: prevRows.length + 1,
            comp_type: '',
            address: '',
            roi: '',
            price: '',
            sq_ft: '',
            lot_acre: '',
            built_year: '',
            days_on_market: '',
            consider: ''
        }]);
    };

    const salecompsrow = () => {

        // $("# test_appended tr").append(prevRows);     
        setsalecomps(prevRows => [...prevRows, {
            id: prevRows.length + 1,
            comp_type: '',
            address: '',
            roi: '',
            price: '',
            sq_ft: '',
            lot_acre: '',
            built_year: '',
            days_on_market: '',
            consider: ''
        }]);

        // $("# test_appended tr").append(prevRows);

    };

    const handleRejectReasonSubmit = () => {
        // Handle the submission logic here
        console.log('Reject Reason Submitted:', rejectReason);
        // Clear the input box if needed
        setRejectReason('');
    };
    const updateRow = (index, field, value) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
        setsalecomps(updatedRows);
    };


    // Dropdown options
    const ratingOptions = [''];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.put('http://10.10.0.33/api/method/sourcing_data'
                    , { ab: Data.data.name },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });

                console.log("Response:", response.data.message[0][0].google_map_link);
                console.log("reponse web:", response.data.message[0][0].website_link);


                setmap(response.data.message[0][0].google_map_link)
                setweb(response.data.message[0][0].website_link)
                setData(Data.data);


                // Extract the message array from the response
                const messageArray = response.data.message;

                const organizedData = {
                    item1: messageArray[0][0],
                    item2: messageArray[1][0],
                    item3: messageArray[2][0],
                    item4: messageArray[3][0]
                };

                setorganizedData(organizedData);

                const initialRows = [...messageArray[2]].map(item => ({
                    id: item.id,
                    comp_type: item.comp_type,
                    address: item.address,
                    roi: item.roi,
                    price: item.price,
                    sq_ft: item.sq_ft,
                    lot_acre: item.lot_acre,
                    built_year: item.built_year,
                    days_on_market: item.days_on_market,
                    consider: item.consider
                }));

                setRows(initialRows);
                // setsalecomps(initialRows);
                const initialsaleRows = [...messageArray[3]].map(item => ({
                    id: item.id,
                    comp_type: item.comp_type,
                    address: item.address,
                    roi: item.roi,
                    price: item.price,
                    sq_ft: item.sq_ft,
                    lot_acre: item.lot_acre,
                    built_year: item.built_year,
                    days_on_market: item.days_on_market,
                    consider: item.consider
                }));

                // setRows(initialRows);
                setsalecomps(initialsaleRows);




                console.log("Message Array:", messageArray);
                console.log("item2", organizedData.item2)
                console.log("loc", organizedData.item2.sold_comps_rating)
                console.log("type", organizedData.item3.comp_type)

                // Loop through the message array to access each item
                messageArray.forEach((item, index) => {
                    // console.log(`Item ${index}:`, item);

                    if (Array.isArray(item)) {
                        item.forEach((subItem, subIndex) => {
                            // console.log(`SubItem ${subIndex}:`, subItem);
                        });
                    }
                });

                const firstElement = messageArray[0];
                // console.log("First Element:", firstElement);

                if (Array.isArray(firstElement) && firstElement.length > 0) {
                    const googleMapLink = firstElement[0].google_map_link;
                    console.log("Google Map Link:", googleMapLink);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        //  console.log("data from api ", data)
        fetchData();

    }, []);
    console.log("data from api ", data)
    // console.log("organizedData:", data.googleMapLink);
    console.log("ss:", data.screening_status);

    // Reject Reason Button
    const handleReject = () => {
        setRejectButton(!rejectButton)
    }
    const handleRejectClose = () => {
        setRejectButton(!rejectButton)
    }

    return (
        <div className={`drawer ${isOpen ? 'open' : 'closed'}`}>
            <div className="drawer-content">
                <div className="drawer_section">
                    <div className="demo_example_container">
                        <div className="demo_example_address-section">
                            <button
                                onClick={onClose}
                                className="drawer-close-button"
                            >
                                X
                            </button>

                            <table className="demo_example_address-table">
                                <thead>
                                    <tr>
                                        <th>Lead ID</th>
                                        <th>Address</th>
                                        <th>Lot Size</th>
                                        <th>Asking price</th>
                                        <th>Assigned To</th>
                                        <th>Market</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 1 }).map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td>{data.name}</td>
                                            <td className="address-cell">{data.address}</td>
                                            <td>{data.land_size_sf}</td>
                                            <td>{data.asking_price}</td>
                                            <td>{data.assigned_bdm}</td>
                                            <td>{data.market}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="demo_example_section">
                            <div className="demo_example_info-section">
                                <div className="demo_example_sidebar">
                                    <a
                                        href={
                                            map
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="demo_example_map-link-button"
                                    >
                                        Map Link
                                    </a>
                                    <a href={
                                        web
                                    }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="demo_example_web-link-button">
                                        Web Link</a>
                                </div>
                                <div className="demo_example_info-text">
                                    <div className="demo_example_info-row">
                                        <p>Status:</p>
                                        <select

                                            onChange={(e) => setStatus(e.target.value)}
                                            className="demo_example_status-select"
                                        >
                                            <option selected value="">{data.screening_status}</option>

                                            {/* {data.screening_status !== 'Select Status' && (
                                                    <option value="Select Status">Select Status</option>
                                                )} */}
                                            {data.screening_status !== 'Rejected' && (
                                                <option value="Rejected">Rejected</option>
                                            )}
                                            {data.screening_status !== 'Qualified' && (
                                                <option value="Qualified">Qualified</option>
                                            )}
                                            {data.screening_status !== 'On Hold' && (
                                                <option value="On Hold">On Hold</option>
                                            )}
                                            {data.screening_status !== 'Yet to Be Screened' && (
                                                <option value="Yet to be Screened">Yet to be Screened</option>
                                            )}
                                            {/* <option value="">Rejected</option>
                                            <option value="">On Hold</option>
                                            <option value="">Yet to Be Screened</option> */}
                                            {/* <option  selected value="">Qualified</option> */}
                                        </select>
                                    </div>

                                    {status === 'Rejected' && (
                                        <div className="demo_example_info-row">
                                            <div>
                                                <button className="demo_example_add-reason-button" onClick={handleReject}>
                                                    Add Reject Reasons
                                                </button>
                                            </div>

                                        </div>
                                    )}


                                </div>
                            </div>
                        </div>

                        <div className="demo_example_section" style={{alignItems:'center'}}>
                        
                            {/* <div className="rating-remarks-container"> */}
                                <div className="rating-section">
                                <h3 style={{fontSize:'25px',color:'white'}}>Location :</h3>
                                        <div className="rating_field">
                                        <div className="stars">
                                        <label>Rating :</label>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    value={locationRating}
                                                    key={star}
                                                    className={`star${locationRating >= star ?'-filled' : ''}`}
                                                    onClick={() => handleStarClick(star, 'location_rating')}
                                                    style={{ cursor: 'pointer', fontSize: '35px' }}
                                                >
                                                    &#9733;
                                                </span>
                                            ))}
                                            {/* <p>Current location Rating: {locationRating}</p> */}
                                        
                                    
                                    <div className="remarks-item">
                                        <label style={{fontSize:'20px'}}>Remarks :</label>
                                        <input
                                            type="text"
                                            value={locationRemarks}
                                            onChange={(e) => setLocationRemarks(e.target.value)}
                                            className="demo_example_remarks-input"
                                        />
                                        </div>
                                        
                                    </div>
                                    </div>
                                    
                                    <h3 style={{fontSize:'25px',color:'white'}}>Sale Comps :</h3>
                                    <div className="rating_field">
                                        
                                        <div className="stars">
                                        <label>Rating :</label>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    value={saleCompsRating}
                                                    key={star}
                                                    className={`star${saleCompsRating >= star ?'-filled' : ''}`}
                                                    onClick={() => handleStarClick(star, 'sale_comps_rating')}
                                                    style={{ cursor: 'pointer', fontSize: '35px' }}
                                                >
                                                    &#9733;
                                                </span>
                                            ))}
                                            <div className="remarks-section">
                                    
                                    <div className="remarks-item">
                                        <label style={{fontSize:'20px'}}>Remarks :</label>
                                        <input
                                            type="text"
                                            value={saleCompsRemarks}
                                            onChange={(e) => setSaleCompsRemarks(e.target.value)}
                                            className="demo_example_remarks-input"
                                        />
                                    </div>
                                        </div>
                                        </div>
                                    </div>
                                    
                                    <h3 style={{fontSize:'25px',color:'white'}}>Sold Comps :</h3>
                                    <div className="rating_field">
                                        <div className="stars">
                                        <label>Rating :</label>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    value={soldCompsRating}
                                                    key={star}
                                                    className={`star${soldCompsRating >= star ?'-filled' : ''}`}
                                                    onClick={() => handleStarClick(star, 'sold_comps_rating')}
                                                    style={{ cursor: 'pointer', fontSize: '35px' }}
                                                >
                                                    &#9733;
                                                </span>
                                            ))}
                                            <div className="remarks-item">
                                        <label style={{fontSize:'20px'}}>Remarks :</label>
                                        <input
                                            type="text"
                                            value={soldCompsRemarks}
                                            onChange={(e) => setSoldCompsRemarks(e.target.value)}
                                            className="demo_example_remarks-input"
                                        />
                                    </div>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="remarks-section">
                                    
                                    <div className="remarks-item">
                                        <label style={{fontSize:'20px'}}>Sale Comps Remarks :</label>
                                        <input
                                            type="text"
                                            value={saleCompsRemarks}
                                            onChange={(e) => setSaleCompsRemarks(e.target.value)}
                                            className="demo_example_remarks-input"
                                        />
                                    </div>
                                    <div className="remarks-item">
                                        <label style={{fontSize:'20px'}}>Sold Comps Remarks :</label>
                                        <input
                                            type="text"
                                            value={soldCompsRemarks}
                                            onChange={(e) => setSoldCompsRemarks(e.target.value)}
                                            className="demo_example_remarks-input"
                                        />
                                    </div>
                                </div> */}
                            {/* </div> */}
                            <div className='showcomps' style={{ display: 'flex', justifyContent: 'space-between', width: '70%', marginleft: '80px' }}>
                                <button
                                    className="demo_example_show-more-button"
                                    onClick={handleToggleTable}>
                                    {showTable ? 'Show Less' : 'Show Comps'}
                                </button>
                                {!showTable && (
                                    <button className="demo_example_save-button">Save</button>
                                )}
                            </div>
                        </div>

                        {showTable && (

                            <div className="demo_example_section">
                                <div className="demo_example_tables-container">
                                    <div
                                        className="demo_sold_comps_bottomdraw"
                                    >
                                        Sold Comp
                                    </div>
                                    <table className="demo_example_table-8x4">
                                        <thead>
                                            <tr>
                                                {/* <th>Comp Type</th> */}
                                                <th>Address</th>
                                                <th>Price</th>
                                                <th>Sq Ft</th>
                                                <th>Lot Acre</th>
                                                <th>Built Year</th>
                                                <th>Days on Market</th>
                                                <th>Consider</th>
                                                <th>ROI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {/* <td>
                                                        <input
                                                            type="text"
                                                            value={row.comp_type}
                                                            onChange={(e) => updateRow(rowIndex, 'comp_type', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td> */}
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={row.address}
                                                            onChange={(e) => updateRow(rowIndex, 'address', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.price}
                                                            onChange={(e) => updateRow(rowIndex, 'price', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.sq_ft}
                                                            onChange={(e) => updateRow(rowIndex, 'sq_ft', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.lot_acre}
                                                            onChange={(e) => updateRow(rowIndex, 'lot_acre', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.built_year}
                                                            onChange={(e) => updateRow(rowIndex, 'built_year', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.days_on_market}
                                                            onChange={(e) => updateRow(rowIndex, 'days_on_market', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={row.consider}
                                                            onChange={(e) => updateRow(rowIndex, 'consider', e.target.value)}
                                                            className="bottom_table_child"
                                                        >
                                                            <option value="NA">NA</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.roi}
                                                            onChange={(e) => updateRow(rowIndex, 'roi', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            {!showTable && (
                                                <button className="demo_example_save-button">Save</button>
                                            )}
                                        </tbody>
                                    </table>
                                    <div >
                                        <button className="demo_example_add-row-button" onClick={addRow}>Add Row</button>
                                    </div>
                                    {/* <button className="demo_example_save-button bottom-right">Save</button> */}
                                </div>
                            </div>
                        )}

                        {showTable && (
                            <div className="demo_example_section">
                                <div className="demo_example_tables-container">
                                    <div className="demo_sold_comps_bottomdraw"
                                    >Sale Comp</div>
                                    <table className="demo_example_table-8x4">
                                        <thead>
                                            <tr>
                                                {/* <th>Comp Type</th> */}
                                                <th>Address</th>
                                                <th>Price</th>
                                                <th>Sq Ft</th>
                                                <th>Lot Acre</th>
                                                <th>Built Year</th>
                                                <th>Days on Market</th>
                                                <th>Consider</th>
                                                <th>ROI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {salecomps.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {/* <td>
                                                        <input
                                                            type="text"
                                                            value={row.comp_type}
                                                            onChange={(e) => updateRow(rowIndex, 'comp_type', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td> */}
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={row.address}
                                                            onChange={(e) => updateRow(rowIndex, 'address', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.price}
                                                            onChange={(e) => updateRow(rowIndex, 'price', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.sq_ft}
                                                            onChange={(e) => updateRow(rowIndex, 'sq_ft', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.lot_acre}
                                                            onChange={(e) => updateRow(rowIndex, 'lot_acre', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.built_year}
                                                            onChange={(e) => updateRow(rowIndex, 'built_year', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.days_on_market}
                                                            onChange={(e) => updateRow(rowIndex, 'days_on_market', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={row.consider}
                                                            onChange={(e) => updateRow(rowIndex, 'consider', e.target.value)}
                                                            className="bottom_table_child"
                                                        >
                                                            <option value="NA">NA</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            inputmode="numeric"
                                                            value={row.roi}
                                                            onChange={(e) => updateRow(rowIndex, 'roi', e.target.value)}
                                                            className="bottom_table_child"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div >
                                        <button className="demo_example_add-row-button" onClick={salecompsrow}>Add Row</button>
                                    </div>
                                    <button className="demo_example_save-button bottom-right">Save</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {rejectButton && (
                        <div style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100vw', height: '100vh', top: '0'
                        }}>
                            <div style={{ width: '40%', backgroundColor: '#06545c', padding: '15px', borderRadius: '10px' }}>
                                {/* <AiTwotoneCloseSquare size={30} onClick={handleRejectClose} style={{ backgroundColor:'red',borderRadius:'15px',fontSize:'15px',cursor:'pointer',color:'White' }} /> */}
                                <button onClick={handleRejectClose} style={{ backgroundColor:'red',borderRadius:'25px',fontSize:'13px',cursor:'pointer',color:'White' }}>X </button>                                
                              <div 
                               style={{backgroundColor:'rgb(21 97 105)'}}
                                >
                                    <p style={{fontSize: '20px',fontWeight:'bold'}}>REJECT REASONS</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection:'row',justifyContent: 'center', alignItems: 'center',marginLeft:'100px'}}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '250px', alignItems: 'center'}} >
                                            <input style={{ alignItems: 'center' }}type="radio" ></input>
                                            <p>High Price</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '250px', alignItems: 'center' }}>
                                            <input style={{ alignItems: 'center' }}type="radio" ></input>
                                            <p>Low Price</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '250px', alignItems: 'center' }}>
                                            <input style={{ alignItems: 'center' }}type="radio" ></input>
                                            <p>Location</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '250px', alignItems: 'center' }}>
                                            <input style={{ alignItems: 'center' }}type="radio" ></input>
                                            <p>Zoning</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '250px', alignItems: 'center' }}>
                                            <input style={{ alignItems: 'center' }}type="radio" ></input>
                                            <p>ROI</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '250px', alignItems: 'center' }}>
                                            <input style={{ alignItems: 'center' }}type="radio" ></input>
                                            <p >Crime Rate</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='RejectreasonInput'>
                                    <input
                                        type="text"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Enter Reason"
                                        className="demo_example_input-box"
                                        style={{color:'rgb(6, 84, 92)'}}
                                    />
                                    <button
                                        onClick={handleRejectReasonSubmit}
                                        className="demo_example_submit-button">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>
    );
}

export default Demo;
