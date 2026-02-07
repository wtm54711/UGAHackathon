public class Request {
	private static int nextId = 1;
	private int requestId;
	private String requestDescription;
	private int requestDifficulty;
	private String location;
	private boolean completed;
    private User requester;

	public Request(User requester,String requestDescription, int requestDifficulty, String location) {
		if (requestDifficulty < 1 || requestDifficulty > 5) {
			throw new IllegalArgumentException("requestDifficulty must be between 1 and 5");
		}
		this.requestId = nextId++;
		this.requestDescription = requestDescription;
		this.requestDifficulty = requestDifficulty;
		this.location = location;
		this.completed = false;
        this.requester = requester;
	}

	public int getRequestId() {
		return requestId;
	}

	public String getRequestDescription() {
		return requestDescription;
	}

	public int getRequestDifficulty() {
		return requestDifficulty;
	}

	public String getLocation() {
		return location;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
        Requests.updateRequests(this);
	}

    public User getRequester() {
        return requester;
    }  

}
