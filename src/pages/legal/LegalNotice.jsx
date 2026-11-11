import LegalDocument from './LegalDocument.jsx';
import { LEGAL_DOCUMENTS } from '../../lib/legalDocuments.js';
import notice from '../../../legal-notice.txt?raw';

export default function LegalNotice() {
    return <LegalDocument seo={LEGAL_DOCUMENTS.legalNotice.seo} html={notice} />;
}
