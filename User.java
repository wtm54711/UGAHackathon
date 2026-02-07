public class User {
	private final int userID;
	private static int currentId = 0;
	private String userName;
	private int requestsMade;
	private int requestsHelped;
	private Request[] currentRequests;
	private String password;


	public User(int userID, String userName, String password) {
		User.currentId++;
		this.userID = currentId;
		this.userName = userName;
		this.requestsMade = 0;
		this.requestsHelped = 0;
		this.currentRequests = new Request[10];
		this.password = password;
	}

	public int getUserID() {
		return userID;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public int getRequestsMade() {
		return requestsMade;
	}

	public void setRequestsMade(int requestsMade) {
		this.requestsMade = requestsMade;
	}

	public int getRequestsHelped() {
		return requestsHelped;
	}

	public void setRequestsHelped(int requestsHelped) {
		this.requestsHelped = requestsHelped;
	}

	public Request[] getCurrentRequests() {
		return currentRequests;
	}


	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Request addRequest() {
		java.util.Scanner scanner = new java.util.Scanner(System.in);
		System.out.print("description: ");
		String desc = scanner.nextLine();
		int diff = 0;
		while (true) {
			System.out.print("difficulty (int): ");
			String line = scanner.nextLine();
			if (line == null) return null;
			line = line.trim();
			if (line.isEmpty()) continue;
			try {
				diff = Integer.parseInt(line);
				break;
			} catch (NumberFormatException ex) {
				System.out.println("Invalid number. Enter an integer.");
			}
		}
		System.out.print("location: ");
		String loc = scanner.nextLine();
		if (this.currentRequests[9] != null) {
			System.out.println("Cannot add more requests, maximum reached.");
			return null;
		}
		int index = 0;
		while (index < 10 && this.currentRequests[index] != null) {
			index++;
		}
		this.currentRequests[index] = new Request(this, desc, diff, loc);
		return this.currentRequests[index];
	}


}
