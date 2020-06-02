import {pki} from 'node-forge';

import {
    NEO4J_JWT_CERT_ATTRS,
    NEO4J_JWT_CERT_BIT_LENGTH,
    NEO4J_JWT_CERT_VALIDITY_YEARS,
} from '../../environments/environment.constants';

export function generatePluginCerts(passphrase: string): {publicKey: string; privateKey: string} {
    // generate a keypair or use one you have already
    const keys = pki.rsa.generateKeyPair(NEO4J_JWT_CERT_BIT_LENGTH);

    // create a new certificate
    const cert = pki.createCertificate();

    // fill the required fields
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + NEO4J_JWT_CERT_VALIDITY_YEARS);

    /**
     * here we set subject and issuer as the same one
     * could also use a CSR
     */
    cert.setSubject(NEO4J_JWT_CERT_ATTRS);
    cert.setIssuer(NEO4J_JWT_CERT_ATTRS);

    // the actual certificate signing
    cert.sign(keys.privateKey);

    return {
        privateKey: pki.encryptRsaPrivateKey(keys.privateKey, passphrase),
        publicKey: pki.certificateToPem(cert),
    };
}
