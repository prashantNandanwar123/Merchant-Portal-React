 // Report Api Call
  // const exportReport = async () => {
  //   try {
  //     const payload = {
  //       fromDate: formatDate(fromDate),
  //       toDate: formatDate(toDate),
  //     };

  //     const response = await axiosInstance.post(
  //       "/dwnMeTxnReport",
  //       payload,
  //       {
  //         responseType: "blob",
  //       }
  //     );

  //     const blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = "Transaction_Report.xlsx";

  //     document.body.appendChild(link);
  //     link.click();

  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };
