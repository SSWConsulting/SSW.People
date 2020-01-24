import React,{ useState }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


const ContactForm = () => {
    const [contactFormName, setcontactFormName] = useState('');
    const [contactFormEmail, setcontactFormEmail] = useState('');
    const [contactFormPhone, setcontactFormPhone] = useState('');
    const [contactFormCompanyName, setcontactFormCompanyName] = useState('');
    const [contactFormNote, setcontactFormNote] = useState('');
    const [contactFormCountry, setcontactFormCountry] = useState('');
    const [contactFormStateText, setcontactFormStateText] = useState('');

    const handleSubmit = async (event)=> {
        let subject = "Consulting enquiry - " + contactFormCompanyName + " - " + contactFormName;
           
        let body = "Consulting enquiry from "  + document.URL + "<br/>";
        body = body + "Company: " + contactFormCompanyName + "<br/>";
        body = body + "Country: " + contactFormCountry + "<br/>";
        if (contactFormStateText == '') {
            setcontactFormStateText('100000008');
        } else {
            body = body + "State:  " + contactFormStateText + "<br/>";
        }
        body = body + "Name:  " + contactFormName + "<br/>";
        body = body + "Phone:   " + contactFormPhone + "<br/>";
        body = body + "Email:   " + contactFormEmail + "<br/>";
        body = body + "Note:    " + contactFormNote + "<br/><br/>";

        const response = await axios.post(
            '/ssw/api/crm/createlead',
            {
                Name: contactFormName,
                Topic: subject,
                Company: contactFormCompanyName,
                Note: contactFormNote,
                Country: contactFormCountry,
                State: contactFormStateText,
                Email: contactFormEmail,
                Phone: contactFormPhone,
                //Recaptcha: grecaptcha.getResponse(),
                EmailSubject: subject,
                EmailBody: body + "The associated CRM lead is "
            },
            { headers: { 'Content-Type': 'application/json' } }
          )
        

        event.preventDefault(); 
    }
  return (
      <form onSubmit={(e) => handleSubmit(e)}>
    <div className="contactUs">
        <div className="contactUs-form">
        <h2>Get your project started!</h2>
        <div className="form-group hidden" id="contactFormAlert">
            <div className="alert alert-success" role="alert">An email has been sent to the SSW Sales team and someone will be in contact with you soon</div>
        </div>
        <div className="form-group">
            <div className="field-wrapper">
                <label htmlFor ="contactFormName" className="control-label">Full Name *</label>
                <input id ="contactFormName" type="text" value={contactFormName} onChange={e=>setcontactFormName(event.target.value)} className="form-control ng-untouched ng-empty ng-invalid ng-invalid-required ng-dirty ng-valid-parse watermark" placeholder="Full Name *"/>
            </div>
        </div>

        <div className="form-group">
            <div className="field-wrapper">
                <label htmlFor ="contactFormEmail" className="control-label">Email *</label>
                <input id ="contactFormEmail" value={contactFormEmail} onChange={e=>setcontactFormEmail(event.target.value)} type="email" className="form-control ng-untouched ng-empty ng-valid-email ng-invalid ng-invalid-required ng-dirty watermark" required="" placeholder="Email *" />
            </div>
        </div>

        <div className="form-group">
            <div className="field-wrapper">
                <label htmlFor ="contactFormPhone" className="control-label">Phone</label>
                <input id="contactFormPhone" value={contactFormPhone} onChange={e=>setcontactFormPhone(event.target.value)} type="text" className="form-control ng-untouched ng-valid ng-empty ng-dirty ng-valid-parse watermark" placeholder="Phone" />
            </div>
        </div>

        <div className="form-group">       
            <div className="field-wrapper list">
                <label htmlFor ="contactFormCountry" className="control-label">Location</label>
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select id ="contactFormCountry" className="form-control ng-untouched ng-empty ng-invalid ng-invalid-required ng-dirty ng-valid-parse" value={contactFormCountry} onChange={e=>setcontactFormCountry(event.target.value)} >
                  <option value="" disabled="" hidden="" selected="">Location</option>
                  <option value="Australia">Australia</option>
                  <option value="China">China</option>
                  <option value="Europe">Europe</option>
                  <option value="SouthAmerica">South America</option>
                  <option value="USA">USA</option>
                  <option value="Other">Other</option>
                </select>
            </div>
        </div>

        <div className="form-group ng-hide" id="contactFormState" ng-show="country=== 'Australia'">            
            <div className="field-wrapper list">
                <label htmlFor ="contactFormState" className="control-label">State</label>
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select id="contactFormState" className="form-control ng-untouched ng-valid ng-empty ng-dirty ng-valid-parse" value={contactFormStateText} onChange={e=>setcontactFormStateText(event.target.value)} >
                    <option value="" disabled="" hidden="" selected="">State</option>
                  <option value="100000000">NSW</option>
                  <option value="100000001">VIC</option>
                  <option value="100000002">QLD</option>
                  <option value="100000003">ACT</option>
                  <option value="100000004">SA</option>
                  <option value="100000005">WA</option>
                  <option value="100000006">NT</option>
                  <option value="100000007">TAS</option>
                  <option value="100000008">Other</option>
                </select>
            </div>
        </div>

        <div className="form-group">
            <div className="field-wrapper">
                <label htmlFor ="contactFormCompanyName" className="control-label">Company</label>
                <input id ="contactFormCompanyName" value={contactFormCompanyName} onChange={e=>setcontactFormCompanyName(event.target.value)} type="text" className="form-control ng-untouched ng-valid ng-empty ng-dirty ng-valid-parse watermark" placeholder="Company" />
            </div>
        </div>

        <div className="form-group">
            <div className="field-wrapper">
                <label htmlFor ="contactFormNote" className="control-label">Message</label>
                 <textarea id ="contactFormNote" value={contactFormNote} onChange={e=>setcontactFormNote(event.target.value)} className="form-control ng-untouched ng-valid ng-empty ng-valid-maxlength ng-dirty ng-valid-parse watermark" placeholder="Note" rows="4" val="" maxLength="2000"></textarea>
            </div>
            <small>Maximium 2000 characters.</small>
        </div>      

        <div className="form-group">
            <button id="contactFormSubmit" className="btn submit" ng-click="submit($event)" ng-disabled="disabled">Submit</button>
        </div>
    </div>
    </div>
    </form>
  );
};

ContactForm.propTypes = {
};

export default ContactForm;
