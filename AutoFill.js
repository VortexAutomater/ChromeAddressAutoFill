for (const el of document.querySelectorAll('body > input'))
  el.remove();

const fileInput = document.createElement('input');
Object.assign(fileInput, {
  type: 'file',
  style: 'position:absolute; top:2ex; right:0; z-index:999',
  onchange(e) {
    if (!this.files[0])
      return;
    const fr = new FileReader();
    fr.readAsText(this.files[0], 'UTF-8');
    fr.onload = () => {
      for (const line of fr.result.split(/\r?\n/)) {
        const fields = line.split(',');
        const [name, company, street, state, city, address3, zip, phone, email] = fields.map(field => field.replace(/^"|"$/g, ''));

        chrome.autofillPrivate.saveAddress({
          fullNames: [name],
          companyName: company,
          addressLines: street,
          addressLevel1: state,
          addressLevel2: city,
          addressLevel3: address3,
          postalCode: zip,
          phoneNumbers: [phone],
          emailAddresses: [email],
        });
      }
    };
    fr.onerror = console.error;
  },
});

document.body.appendChild(fileInput);
