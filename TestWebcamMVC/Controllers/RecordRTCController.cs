using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using TestWebcamMVC.Models;
using Newtonsoft.Json.Linq;

namespace TestWebcamMVC.Controllers
{
    public class RecordRTCController : Controller
    {
        //
        // GET: /RecordRTC/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult PostRecordedAudioVideo(List<CamFiles> files)
        {
            var file = files;
            //foreach (var file in files)
            //{
            //    if (file.ContentLength > 0)
            //    {
            //        var fileName = Path.GetFileName(file.FileName);
            //        var path = Path.Combine(Server.MapPath("~/App_Data/uploads"), fileName);
            //        file.SaveAs(path);
            //    }
            //}
            //return Json(Request.Form[0]);
            return Redirect("index");
        }

        public ActionResult GetSomeStuff()
        {
            var test = new List<Videos>();

            test.Add(new Videos { id = 1, name = "some name", desc = "Here is a description" });
            test.Add(new Videos { id = 2, name = "second", desc = "More typing for snyping." });

            return Json(test, JsonRequestBehavior.AllowGet);
        }


	}
}