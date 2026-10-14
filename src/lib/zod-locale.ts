import { z } from 'zod';

// French default messages for every Zod issue (explicit messages in schemas still win).
z.config(z.locales.fr());
