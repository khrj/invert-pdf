# Invert PDF

- Inverts PDFs or batches of PDFs
- Inverted PDFs are larger since they're images of the original
- Computation intensive. `scheduler.js` spawns multiple `node` processes. Number
  of processes should be adjusted according to number of cores