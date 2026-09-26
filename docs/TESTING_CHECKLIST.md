# EduGenie Testing Checklist

## Functional
- [ ] Homepage loads
- [ ] Navigation links work
- [ ] API health status appears
- [ ] Ask EduGenie validates empty input
- [ ] Ask EduGenie returns demo mode without key
- [ ] Ask EduGenie returns AI answer with key
- [ ] Quiz validates topic
- [ ] Quiz renders options
- [ ] Note creation works
- [ ] Note deletion works
- [ ] Planner creation works
- [ ] Planner deletion works

## Responsive
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

## Security
- [ ] `.env` is not committed
- [ ] API key is not in frontend JavaScript
- [ ] Production CORS is restricted
- [ ] Authentication is added before multi-user deployment
