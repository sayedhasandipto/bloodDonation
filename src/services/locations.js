export const getDistricts = async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json');
    if (!res.ok) throw new Error("Failed to fetch districts");
    const data = await res.json();
    return data[2].data; // Assuming the structure based on the repo. 
  } catch (error) {
    console.error("Error fetching districts:", error);
    // Fallback mock data
    return [
      { id: '1', name: 'Dhaka', bn_name: 'ঢাকা' },
      { id: '2', name: 'Chittagong', bn_name: 'চট্টগ্রাম' }
    ];
  }
};

export const getUpazilas = async (districtNameOrId) => {
  try {
    // Need districts to map name to id
    const distRes = await fetch('https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json');
    const distData = await distRes.json();
    const districts = distData[2].data;
    
    let districtId = districtNameOrId;
    const districtObj = districts.find(d => d.name === districtNameOrId || d.id === districtNameOrId);
    if (districtObj) {
      districtId = districtObj.id;
    }

    const res = await fetch('https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json');
    if (!res.ok) throw new Error("Failed to fetch upazilas");
    const data = await res.json();
    const upazilas = data[2].data; // structure based on nuhil's repo format
    return upazilas.filter((u) => u.district_id === districtId);
  } catch (error) {
    console.error("Error fetching upazilas:", error);
    // Fallback mock data
    return [{ id: '101', district_id: '1', name: 'Savar', bn_name: 'সাভার' }];
  }
};
